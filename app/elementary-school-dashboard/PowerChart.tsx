"use client";

import { useState, useEffect, useRef } from "react";
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
  const [loading, setLoading] = useState(true); // 初期状態はloading true（全体表示でデータ取得）
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(true); // 初期状態は実行状態（全体表示）
  const [localData, setLocalData] = useState<PowerChartData | null>(null); // ローカルに保存されたデータ
  const [startTime, setStartTime] = useState<Date | null>(null); // 記録開始時刻
  const [isFullView, setIsFullView] = useState(true); // 全体表示モード（初期状態）
  const [wasStopped, setWasStopped] = useState(false); // 停止されていたかどうか

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      if (!isRunning) return; // 停止中は取得しない

      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-power-history?session_id=${sessionId}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json: PowerChartData = await res.json();

        // 全体表示モードの場合は全データを使用
        if (isFullView) {
          setData(json);
          setLocalData(json);
        } else if (startTime) {
          // 部分表示モードの場合、startTime以降のデータをフィルタリング
          const filteredData: PowerChartData = {
            timeLabels: [],
            geothermal: [],
            hydro: [],
            wind: [],
            solar: [],
          };

          json.timeLabels.forEach((timeLabel, index) => {
            const dataTime = new Date(timeLabel);
            if (dataTime >= startTime) {
              filteredData.timeLabels.push(timeLabel);
              filteredData.geothermal.push(json.geothermal[index]);
              filteredData.hydro.push(json.hydro[index]);
              filteredData.wind.push(json.wind[index]);
              filteredData.solar.push(json.solar[index]);
            }
          });

          setData(filteredData);
          setLocalData(filteredData);
        } else {
          setData(json);
          setLocalData(json);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error(err);
        setError(errorMessage || "Failed to fetch power history");
      } finally {
        setLoading(false);
      }
    };

    // 初回即時実行
    if (isRunning) {
      fetchData();
    }

    // 3秒ごとにデータ再取得（isRunningがtrueの時のみ）
    if (isRunning) {
      intervalId = setInterval(fetchData, 3000);
    }

    // クリーンアップ
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionId, isRunning, startTime, isFullView]);

  // ボタンハンドラー関数
  const handleStart = () => {
    // startTimeが設定されていない場合のみ新しい時刻を設定（初回スタート時）
    if (!startTime) {
      setStartTime(new Date()); // 現在時刻を記録開始時刻として設定
    }
    setIsRunning(true);
    setLoading(true);
    setIsFullView(false); // スタート時は部分表示モードに
    setWasStopped(false); // 停止フラグをリセット
  };

  const handleStop = () => {
    setIsRunning(false);
    setWasStopped(true); // 停止フラグを設定
  };

  const handleClear = () => {
    setData(null);
    setLocalData(null);
    setError(null);
    setLoading(false); // クリア後はloadingをfalseに
    setIsRunning(false); // クリア後は停止状態に
    setStartTime(null); // 開始時刻もリセット
    setIsFullView(false); // クリア後は部分表示モードに
    setWasStopped(false); // 停止フラグもリセット
  };

  const handleFullView = () => {
    setIsFullView(true);
    setIsRunning(true); // 全体表示時はデータ取得を開始
    setLoading(true);
  };

  if (loading && isRunning) {
    return (
      <div className="w-full">
        {/* コントロールボタン */}
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`px-4 py-2 rounded font-semibold ${
              isRunning
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            スタート
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className={`px-4 py-2 rounded font-semibold ${
              !isRunning
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            ストップ
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600"
          >
            クリア
          </button>
          <button
            onClick={handleFullView}
            disabled={isFullView}
            className={`px-4 py-2 rounded font-semibold ${
              isFullView
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            全体表示
          </button>
        </div>

        {/* ローディング画面 */}
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">データを読み込み中です...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        {/* コントロールボタン */}
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`px-4 py-2 rounded font-semibold ${
              isRunning
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            スタート
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className={`px-4 py-2 rounded font-semibold ${
              !isRunning
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            ストップ
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600"
          >
            クリア
          </button>
          <button
            onClick={handleFullView}
            disabled={isFullView}
            className={`px-4 py-2 rounded font-semibold ${
              isFullView
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            全体表示
          </button>
        </div>

        {/* エラー画面 */}
        <div className="flex items-center justify-center h-96 bg-red-50 rounded border-2 border-dashed border-red-300">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg font-semibold mb-2">
              エラーが発生しました
            </p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 表示するデータを決定（停止中はlocalDataを使用、実行中はdataを使用）
  const displayData = isRunning ? data : localData;

  // データがない場合の処理
  if (!displayData) {
    return (
      <div className="w-full">
        {/* コントロールボタン */}
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`px-4 py-2 rounded font-semibold ${
              isRunning
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            スタート
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className={`px-4 py-2 rounded font-semibold ${
              !isRunning
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            ストップ
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600"
          >
            クリア
          </button>
          <button
            onClick={handleFullView}
            className="px-4 py-2 rounded font-semibold bg-purple-500 text-white hover:bg-purple-600"
          >
            全体表示
          </button>
        </div>

        {/* データがない場合のメッセージ */}
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">
            スタートボタンを押してグラフの記録を開始してください
          </p>
        </div>
      </div>
    );
  }

  // 時間軸とデータの処理
  let labels = displayData.timeLabels;
  let geothermalData = displayData.geothermal;
  let hydroData = displayData.hydro;
  let windData = displayData.wind;
  let solarData = displayData.solar;

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
        label: "ボタン発電",
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
      title: {
        display: true,
        text: isFullView ? "発電量推移 (全体表示)" : "発電量推移",
      },
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

  return (
    <div className="w-full">
      {/* コントロールボタン */}
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className={`px-4 py-2 rounded font-semibold ${
            isRunning
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          スタート
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className={`px-4 py-2 rounded font-semibold ${
            !isRunning
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          ストップ
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600"
        >
          クリア
        </button>
        <button
          onClick={handleFullView}
          disabled={isFullView}
          className={`px-4 py-2 rounded font-semibold ${
            isFullView
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
        >
          全体表示
        </button>
      </div>

      {/* グラフ */}
      <Line data={chartData} options={options} />
    </div>
  );
};
