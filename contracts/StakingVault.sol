// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//IMPORTAMOS OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/utils/Pausable.sol"; 


contract StakingVault is ReentrancyGuard, Ownable, Pausable { 

    IERC20 public stakingToken; //Tokens deposited per user
    IERC20 public rewardToken; //Tokens Preview Depostitated for pay to users 

   //VAR
    uint public totalSupply;
    uint public duration = 7 days;
    uint public periodFinish;

    //VAR REWARDS
    uint public rewardRate; //Token reward per second
    uint public lastUpdateTime; //last time update
    uint public rewardPerTokenStored; //Reward acomulated

    //MAPPINGS 
    mapping (address=>uint) public userRewardPerTokenPaid; //Checkpoint user
    mapping (address => uint) public rewards; //Pedient Rewards
    mapping (address => uint) public balanceOf; //Balance total Address to contract
    

    //EVENTS
    event Staked(address indexed user, uint amount);
    event Withdrawn(address indexed user, uint amount);
    event RewardPaid(address indexed user, uint reward);
    event rewardAdded(uint reward);

    //CONSTRUCTOR
    constructor(address __stakingToken, address _rewardToken) Ownable(msg.sender) {
           
           stakingToken = IERC20(__stakingToken);
           rewardToken  = IERC20(_rewardToken);
    }


    //FUNCTION STAKE (DEPOSIT) Revisar si cualquier direccion deposita a la direccion del contrato
    //QUE PASA CON LOS BALANCES MENORES A 1 como 0.9??
    function stake(uint amount) external nonReentrant whenNotPaused {

        require(amount > 0,"Amount = 0");

        updateRewards(msg.sender);

        stakingToken.transferFrom(msg.sender, address(this), amount);

        balanceOf[msg.sender] += amount;
        totalSupply += amount;

        emit Staked(msg.sender, amount);
        
    }   

    //FUNCTION WITHDRAW  Qe pasa si una direccion retira mas de lo que ingreso??    
    function withdraw(uint amount) external nonReentrant whenNotPaused {

        require(amount > 0, "Amount = 0");
        require(balanceOf[msg.sender] >= amount, "Insufficient Balance");
        
        updateRewards(msg.sender); 

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;

        stakingToken.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
        
    }

    //FUNCTION REWARD PER TOKEN
    function rewardPerToken() public view returns (uint) {

        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        //                                     time transcurred   * tokens rewards per second / total de Tokens
        return rewardPerTokenStored +((block.timestamp - lastUpdateTime) * rewardRate * 1e18 / totalSupply);
    }

    //FUNCTION EARNED 
    function earned(address account) public view  returns (uint) {

        return (balanceOf[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18 ) + rewards[account]; 
    }

    //FUNCTION UPDATE REWARDS
    function updateRewards(address account) internal {
 
         rewardPerTokenStored = rewardPerToken();
         lastUpdateTime = block.timestamp;  

         if (account != address(0)) {
              rewards[account] = earned(account);
              userRewardPerTokenPaid[account] = rewardPerTokenStored;
         }       
    }
    
    //FUNCTION CLAIM REWARDS per user
    function claimReward() external nonReentrant {
        
       require( rewardToken.balanceOf(address(this)) >= rewardRate,"Insufficient reward tokens"
       );
        updateRewards(msg.sender);
        
        
        uint reward = rewards[msg.sender];  
        require(reward > 0, "Ups! no rewards"); 
        rewards[msg.sender] = 0;
        rewardToken.transfer((msg.sender), reward);

        emit RewardPaid(msg.sender, reward);
        
    }

    //FUNCTION NOTIFY REWARDS AMOUNT 
    function notifyRewardAmount(uint reward) external onlyOwner {

        updateRewards(address(0));

        require(reward > 0,"Reward  = 0");
        require(rewardRate * duration <= rewardToken.balanceOf(address(this)),"Insufficient reward Balance!");

        if (block.timestamp >= periodFinish) {
            rewardRate = reward / duration;
        }else{
            uint remaining = periodFinish - block.timestamp;
            uint leftover = remaining * rewardRate;
            rewardRate = (reward + leftover) / duration;
        }

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + duration;

        rewardToken.transferFrom(msg.sender,address(this), reward);

        emit rewardAdded(reward);
        
    }

    //FUNCTION PAUSE 
    function pausse() external onlyOwner {
        _pause();
        
    }
    function unpause() external onlyOwner {
        _unpause();
    }


}