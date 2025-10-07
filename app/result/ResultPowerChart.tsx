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
  totalPower?: number;
}

interface PowerLineChartProps {
  sessionId: string;
}

export const ResultPowerLineChart = ({ sessionId }: PowerLineChartProps) => {
  const [data, setData] = useState<PowerChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPower, setTotalPower] = useState<number>(0);
  const [filterTime, setFilterTime] = useState(""); // 時間フィルター用の時間

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-power-history?session_id=${sessionId}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json: PowerChartData = await res.json();

        // APIから空のデータまたは無効なデータが返ってきた場合の処理
        if (!json || !json.timeLabels || json.timeLabels.length === 0) {
          // 空のデータ構造を設定
          const emptyData: PowerChartData = {
            timeLabels: [],
            geothermal: [],
            hydro: [],
            wind: [],
            solar: [],
          };
          setData(emptyData);
          return;
        }

        // totalPowerを更新
        if (json.totalPower !== undefined) {
          setTotalPower(json.totalPower);
        }

        // 結果表示では全データを使用
        setData(json);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error(err);
        setError(errorMessage || "Failed to fetch power history");
      } finally {
        setLoading(false);
      }
    };

    // 初回のみデータを取得
    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">
            グラフデータを読み込み中です...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded border-2 border-dashed border-red-300">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg font-semibold mb-2">
            グラフデータの取得に失敗しました
          </p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // データがない場合は空のグラフを表示
  if (!data || !data.timeLabels || data.timeLabels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">グラフデータがありません</p>
      </div>
    );
  }

  // 時間文字列を秒に変換する関数
  const timeToSeconds = (timeStr: string): number => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + (seconds || 0);
  };

  // 時間フィルタリング関数
  const filterDataByTime = (data: PowerChartData) => {
    if (filterTime.trim() === "") {
      return data;
    }

    const filterTimeInSeconds = timeToSeconds(filterTime);
    const filteredIndices: number[] = [];

    data.timeLabels.forEach((label, index) => {
      const labelTimeInSeconds = timeToSeconds(label);
      if (labelTimeInSeconds >= filterTimeInSeconds) {
        filteredIndices.push(index);
      }
    });

    return {
      timeLabels: filteredIndices.map((i) => data.timeLabels[i]),
      geothermal: filteredIndices.map((i) => data.geothermal[i]),
      hydro: filteredIndices.map((i) => data.hydro[i]),
      wind: filteredIndices.map((i) => data.wind[i]),
      solar: filteredIndices.map((i) => data.solar[i]),
    };
  };

  // フィルタリングされたデータを取得
  const filteredData = filterDataByTime(data);

  const chartData = {
    labels: filteredData.timeLabels,
    datasets: [
      {
        label: "地熱",
        data: filteredData.geothermal,
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.4)",
        fill: true,
      },
      {
        label: "太陽光",
        data: filteredData.solar,
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251,191,36,0.4)",
        fill: "-1",
      },
      {
        label: "風力",
        data: filteredData.wind,
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.4)",
        fill: "-1",
      },
      {
        label: "人力発電",
        data: filteredData.hydro,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.4)",
        fill: "-1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "各モジュールにおける発電能力の推移",
        font: {
          size: 20,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "発電能力(kW)",
          font: {
            size: 20,
            weight: "bold" as const,
          },
        },
        ticks: {
          font: {
            size: 20,
          },
        },
      },
      x: {
        stacked: true,
        title: {
          display: true,
          text: "時間",
          font: {
            size: 20,
            weight: "bold" as const,
          },
        },
        ticks: {
          font: {
            size: 20,
          },
        },
      },
    },
  };

  return (
    <div className="w-full">
      {/* 総発電量表示と時間フィルター */}
      <div className="flex items-center justify-center gap-6 mb-4">
        {/* 総発電量表示 */}
        <div className="px-4 py-2 rounded font-semibold bg-blue-100 border border-blue-300 text-blue-800">
          総発電量 {totalPower.toFixed(2)}kWh
        </div>

        {/* 時間フィルター */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            表示開始時刻:
          </label>
          <input
            type="time"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="1"
            placeholder="例: 14:30:00"
          />
        </div>
      </div>

      {/* グラフ */}
      <Line data={chartData} options={options} />
    </div>
  );
};
