// components/PowerLineChart.tsx
"use client";

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
  Filler, // 塗りつぶしに必要
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

interface PowerLineChartProps {
  timeLabels: string[];
  geothermal: number[];
  hydro: number[];
  wind: number[];
  solar: number[];
}

export const PowerLineChart = ({
  timeLabels,
  geothermal,
  hydro,
  wind,
  solar,
}: PowerLineChartProps) => {
  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: "地熱",
        data: geothermal,
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.4)", // 赤 半透明
        fill: true, // 下（x軸まで）塗る
      },
      {
        label: "水力",
        data: hydro,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.4)", // 青 半透明
        fill: "-1", // 地熱まで塗る
      },
      {
        label: "風力",
        data: wind,
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.4)", // 緑 半透明
        fill: "-1", // 水力まで塗る
      },
      {
        label: "太陽光",
        data: solar,
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251,191,36,0.4)", // 黄 半透明
        fill: "-1", // 風力まで塗る
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "発電量推移",
      },
    },
    scales: {
      y: {
        stacked: true, // 積み上げ必須
        title: {
          display: true,
          text: "発電量 (kW)",
        },
      },
      x: {
        stacked: true,
        title: {
          display: true,
          text: "時間",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};
