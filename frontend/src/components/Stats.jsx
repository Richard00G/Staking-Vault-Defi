import { formatEther } from "viem";
import { fmt } from "../lib/format";
import Stat from "./Stat";
import { useNow } from "../hooks/useNow";

function periodLabel(periodFinish, now) {
  if (periodFinish === undefined) return "—";
  const end = Number(periodFinish) * 1000;
  if (end <= now) return "Sin rewards activos";
  const days = (end - now) / 86_400_000;
  return days >= 1 ? `${days.toFixed(1)} días restantes` : `${(days * 24).toFixed(1)} h restantes`;
}

export default function Stats({ v }) {
  const now = useNow();
  const active = v.periodFinish !== undefined && Number(v.periodFinish) * 1000 > now;
  const perDay = v.rewardRate !== undefined && active ? Number(formatEther(v.rewardRate)) * 86_400 : 0;

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat label="Total stakeado (vault)" value={fmt(v.totalStaked, 2)} unit="STK" />
      <Stat label="Rewards por día (vault)" value={perDay.toLocaleString("es-MX", { maximumFractionDigits: 2 })} unit="RWD" />
      <Stat label="Periodo de rewards" value={periodLabel(v.periodFinish, now)} />
      <Stat label="Tu stake" value={fmt(v.staked)} unit="STK" accent />
    </div>
  );
}
