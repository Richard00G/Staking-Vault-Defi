import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";

export default function RewardsChart({ getRewards }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const reward = await getRewards();

      setData(prev => [
        ...prev,
        { time: Date.now(), reward },
      ].slice(-10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LineChart width={400} height={200} data={data}>
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="reward" stroke="#22c55e" />
    </LineChart>
  );
}
