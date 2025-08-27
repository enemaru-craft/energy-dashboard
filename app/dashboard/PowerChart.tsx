"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PowerChartData {
  timeLabels: string[];
  geothermal: number[];
  hydro: number[];
  wind: number[];
  solar: number[];
}

interface PowerLineChartProps {
  sessionId: string;
}

export const PowerLineChart = ({ sessionId }: PowerLineChartProps) => {
  const [data, setData] = useState<PowerChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-power-history?session_id=${sessionId}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json: PowerChartData = await res.json();
        console.log(json);
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch power history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (loading) return <p>Loading power history...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  // timeLabels を「時:分」に変換 (+9時間)
  const labels = data.timeLabels.map((t) => {
    const dt = new Date(t);
    dt.setHours(dt.getHours() + 9); // 必要なら削除
    const h = dt.getHours().toString().padStart(2, "0");
    const m = dt.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "地熱",
        data: data.geothermal,
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.4)",
        fill: true,
      },
      {
        label: "水力",
        data: data.hydro,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.4)",
        fill: "-1",
      },
      {
        label: "風力",
        data: data.wind,
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.4)",
        fill: "-1",
      },
      {
        label: "太陽光",
        data: data.solar,
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251,191,36,0.4)",
        fill: "-1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "発電量推移" },
    },
    scales: {
      y: {
        stacked: true,
        title: { display: true, text: "総発電量 (kW)" },
      },
      x: {
        stacked: true,
        title: { display: true, text: "時間" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
