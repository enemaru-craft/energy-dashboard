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
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-power-history?session_id=${sessionId}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json: PowerChartData = await res.json();
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch power history");
      } finally {
        setLoading(false);
      }
    };

    // 初回即時実行
    fetchData();

    // 3秒ごとにデータ再取得
    intervalId = setInterval(fetchData, 3000);

    // クリーンアップ
    return () => clearInterval(intervalId);
  }, [sessionId]);

  if (loading) return <p>Loading power history...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  // 時間軸とデータの処理
  let labels = data.timeLabels;
  let geothermalData = data.geothermal;
  let hydroData = data.hydro;
  let windData = data.wind;
  let solarData = data.solar;

  // データが1つしかない場合、1分前の時間を追加
  if (labels.length === 1) {
    const currentTime = new Date(labels[0]);
    const previousTime = new Date(currentTime.getTime() - 60000); // 1分前
    const previousTimeString = previousTime.toISOString();

    // 時間軸に1分前を追加（最初に配置）
    labels = [previousTimeString, ...labels];

    // 各発電量データに0を追加（最初に配置）
    geothermalData = [0, ...geothermalData];
    hydroData = [0, ...hydroData];
    windData = [0, ...windData];
    solarData = [0, ...solarData];
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "地熱",
        data: geothermalData,
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.4)",
        fill: true,
      },
      {
        label: "水力",
        data: hydroData,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.4)",
        fill: "-1",
      },
      {
        label: "風力",
        data: windData,
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.4)",
        fill: "-1",
      },
      {
        label: "太陽光",
        data: solarData,
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
        beginAtZero: true,
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
