import { vault } from "../lib/contracts";
import { fmt } from "../lib/format";
import { useTx } from "../hooks/useTx";
import { useCorrectNetwork } from "../hooks/useCorrectNetwork";
import Card from "../components/Card";
import Button from "../components/Button";
import Stat from "../components/Stat";
import TxStatus from "../components/TxStatus";

export default function RewardsSection({ v }) {
  const tx = useTx();
  const ok = useCorrectNetwork();
  const hasRewards = (v.earned ?? 0n) > 0n;

  const claim = () =>
    tx.run([[{ ...vault, functionName: "claimReward" }, "Cobrar rewards"]], "Rewards cobrados 🎁", v.refetch);

  return (
    <Card title="Rewards" subtitle="Se acumulan cada segundo mientras tengas STK stakeado.">
      <Stat label="Por cobrar" value={fmt(v.earned, 6)} unit="RWD" accent />
      <Button color="blue" onClick={claim} disabled={!ok || !hasRewards} loading={tx.busy}>
        Cobrar rewards
      </Button>
      <TxStatus {...tx} />
    </Card>
  );
}
