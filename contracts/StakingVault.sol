// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title StakingVault v2
/// @notice Stake `stakingToken` and earn `rewardToken` over fixed reward periods
///         (Synthetix StakingRewards model).
contract StakingVault is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken; // Token que depositan los usuarios
    IERC20 public immutable rewardToken;  // Token con el que se pagan los rewards

    uint256 public totalSupply;           // Total stakeado en el vault
    uint256 public duration = 7 days;     // Duración de cada periodo de rewards
    uint256 public periodFinish;          // Fin del periodo actual

    uint256 public rewardRate;            // Rewards por segundo
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public balanceOf;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardAdded(uint256 reward);
    event DurationUpdated(uint256 newDuration);
    event Recovered(address token, uint256 amount);

    error ZeroAmount();
    error ZeroAddress();
    error InsufficientBalance();
    error NoRewards();
    error RewardTooHigh();
    error PeriodNotFinished();
    error CannotRecoverVaultToken();

    constructor(address _stakingToken, address _rewardToken) Ownable(msg.sender) {
        if (_stakingToken == address(0) || _rewardToken == address(0)) revert ZeroAddress();
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    // ---------------------------------------------------------------- views

    /// @notice Los rewards solo corren hasta que termina el periodo.
    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) return rewardPerTokenStored;
        return rewardPerTokenStored
            + ((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18) / totalSupply;
    }

    function earned(address account) public view returns (uint256) {
        return (balanceOf[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18
            + rewards[account];
    }

    /// @notice Rewards totales que reparte el periodo actual.
    function getRewardForDuration() external view returns (uint256) {
        return rewardRate * duration;
    }

    // ---------------------------------------------------------------- user

    function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();
        totalSupply += amount;
        balanceOf[msg.sender] += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    /// @dev Sin `whenNotPaused`: los usuarios siempre pueden sacar su dinero.
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();
        if (balanceOf[msg.sender] < amount) revert InsufficientBalance();
        totalSupply -= amount;
        balanceOf[msg.sender] -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function claimReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward == 0) revert NoRewards();
        rewards[msg.sender] = 0;
        rewardToken.safeTransfer(msg.sender, reward);
        emit RewardPaid(msg.sender, reward);
    }

    /// @notice Retira todo y cobra rewards en una sola transacción.
    function exit() external {
        withdraw(balanceOf[msg.sender]);
        if (rewards[msg.sender] > 0) claimReward();
    }

    // ---------------------------------------------------------------- owner

    /// @notice Deposita `reward` tokens y arranca (o extiende) un periodo de rewards.
    function notifyRewardAmount(uint256 reward) external onlyOwner updateReward(address(0)) {
        if (reward == 0) revert ZeroAmount();

        rewardToken.safeTransferFrom(msg.sender, address(this), reward);

        if (block.timestamp >= periodFinish) {
            rewardRate = reward / duration;
        } else {
            uint256 leftover = (periodFinish - block.timestamp) * rewardRate;
            rewardRate = (reward + leftover) / duration;
        }
        if (rewardRate == 0) revert ZeroAmount();

        // El vault debe tener fondos para pagar todo el periodo nuevo.
        // Si el reward token es el mismo que el de staking, no cuenta lo stakeado.
        uint256 balance = rewardToken.balanceOf(address(this));
        if (address(rewardToken) == address(stakingToken)) balance -= totalSupply;
        if (rewardRate > balance / duration) revert RewardTooHigh();

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + duration;
        emit RewardAdded(reward);
    }

    function setRewardsDuration(uint256 _duration) external onlyOwner {
        if (block.timestamp <= periodFinish) revert PeriodNotFinished();
        if (_duration == 0) revert ZeroAmount();
        duration = _duration;
        emit DurationUpdated(_duration);
    }

    /// @notice Rescata tokens enviados por error. Nunca permite sacar el token de
    ///         staking ni el de rewards (son dinero de los usuarios).
    function recoverERC20(address token, uint256 amount) external onlyOwner {
        if (token == address(stakingToken) || token == address(rewardToken)) {
            revert CannotRecoverVaultToken();
        }
        IERC20(token).safeTransfer(owner(), amount);
        emit Recovered(token, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
