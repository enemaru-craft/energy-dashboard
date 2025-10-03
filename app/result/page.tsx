"use client";

import { useState, useEffect } from "react";
import { PowerLineChart } from "../dashboard/PowerChart";
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

interface TeamResultData {
  teamName: string;
  totalPower: number;
  peakPower: number;
  peakTime: string;
  co2Reduction: number;
  complaints: {
    environment: number;
    stability: number;
    infrastructure: number;
  };
  timeSeriesData: {
    labels: string[];
    powerData: number[];
  };
}

interface ResultData {
  team1: TeamResultData;
  team2: TeamResultData;
}

export default function ResultPage() {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 換算関数
  const calculateSchools = (kwh: number) => Math.floor(kwh / 30); // 学校1校 = 30kWh
  const calculateGyms = (kw: number) => Math.floor(kw / 15); // 体育館1個 = 15kW
  const calculateCows = (co2kg: number) => Math.floor(co2kg / 8); // 牛1頭 = 8kg CO₂/日
  const calculateHappiness = (complaints: TeamResultData["complaints"]) => {
    const total =
      complaints.environment + complaints.stability + complaints.infrastructure;
    return Math.max(0, Math.min(100, 100 - total * 3));
  };

  // 環境ダメージの視覚化
  const getEnvironmentEmoji = (co2Reduction: number) => {
    if (co2Reduction > 40)
      return { forest: "🌳🌳🌳", sky: "☀️", animals: "🐝🦋🐛" };
    if (co2Reduction > 25)
      return { forest: "🌳🌳🌿", sky: "⛅", animals: "🐝🦋" };
    return { forest: "🌿🍃", sky: "☁️", animals: "🐝" };
  };

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const team1Name = localStorage.getItem("team1Name") || "チーム1";
        const team2Name = localStorage.getItem("team2Name") || "チーム2";

        const mockData: ResultData = {
          team1: {
            teamName: team1Name,
            totalPower: 125.6,
            peakPower: 45.2,
            peakTime: "14:30",
            co2Reduction: 43.8,
            complaints: { environment: 8, stability: 5, infrastructure: 3 },
            timeSeriesData: {
              labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
              powerData: Array.from({ length: 24 }, (_, i) => {
                const peak = i === 14 ? 45.2 : Math.random() * 35 + 5;
                return peak;
              }),
            },
          },
          team2: {
            teamName: team2Name,
            totalPower: 98.3,
            peakPower: 38.7,
            peakTime: "13:45",
            co2Reduction: 35.2,
            complaints: { environment: 12, stability: 9, infrastructure: 6 },
            timeSeriesData: {
              labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
              powerData: Array.from({ length: 24 }, (_, i) => {
                const peak = i === 13 ? 38.7 : Math.random() * 30 + 3;
                return peak;
              }),
            },
          },
        };

        setResultData(mockData);
      } catch {
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">リザルトを集計中...</p>
        </div>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl text-red-600">
            {error || "データが見つかりません"}
          </p>
        </div>
      </div>
    );
  }

  // チーム別計算
  const team1Schools = calculateSchools(resultData.team1.totalPower);
  const team1Gyms = calculateGyms(resultData.team1.peakPower);
  const team1Cows = calculateCows(resultData.team1.co2Reduction);
  const team1Happiness = calculateHappiness(resultData.team1.complaints);
  const team1Environment = getEnvironmentEmoji(resultData.team1.co2Reduction);

  const team2Schools = calculateSchools(resultData.team2.totalPower);
  const team2Gyms = calculateGyms(resultData.team2.peakPower);
  const team2Cows = calculateCows(resultData.team2.co2Reduction);
  const team2Happiness = calculateHappiness(resultData.team2.complaints);
  const team2Environment = getEnvironmentEmoji(resultData.team2.co2Reduction);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "24時間発電量推移",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "発電量 (kW)" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgb(194,238,112)] to-[rgb(60,223,156)] p-6">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* チーム1詳細 */}
          <div>
            <div>
              <section className="flex-1 border rounded-4xl bg-white shadow-2xl p-6 mb-6">
                <PowerLineChart sessionId={"72"} />
              </section>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-600 mb-2 flex items-center justify-center">
                  <span className="text-4xl mr-2">🛡️</span>
                  {resultData.team1.teamName}
                  <span className="text-4xl ml-2">🛡️</span>
                </h2>
              </div>

              {/* 総発電量（がんばり度） */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">⚡</span>
                  <span className="text-2xl font-bold text-blue-800">
                    総発電量（がんばり度）
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-blue-700 mb-2 animate-pulse">
                    {resultData.team1.totalPower.toFixed(1)} kWh
                  </div>
                </div>

                {/* プログレスバー */}
                <div className="w-full bg-gray-300 rounded-full h-6 mb-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 h-6 rounded-full transition-all duration-2000 shadow-lg"
                    style={{
                      width: `${Math.min(
                        100,
                        (resultData.team1.totalPower / 150) * 100
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-blue-200">
                  <p className="text-2xl text-blue-800 font-bold text-center mb-2">
                    🏫 学校{" "}
                    <span className="text-3xl text-green-600">
                      {team1Schools}
                    </span>{" "}
                    校分を動かせる！
                  </p>
                  <p className="text-lg text-blue-700 text-center">
                    🌟 小学校1校の1日分の電気 = 約30kWh
                  </p>
                </div>
              </div>

              {/* 最大瞬間発電量（ピークパワー） */}
              <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🚀</span>
                  <span className="text-2xl font-bold text-orange-800">
                    いちばんがんばった瞬間
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-orange-700 mb-2 animate-bounce">
                    {resultData.team1.peakPower.toFixed(1)} kW
                  </div>
                  <div className="text-xl text-orange-700 font-semibold">
                    🕐 {resultData.team1.peakTime} にピーク達成！
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-orange-200">
                  <p className="text-2xl text-orange-800 font-bold text-center mb-2">
                    🏟️ 体育館{" "}
                    <span className="text-3xl text-red-600">{team1Gyms}</span>{" "}
                    個分の電気！
                  </p>
                  <p className="text-lg text-orange-700 text-center">
                    💪 瞬間最大パワーがすごい！
                  </p>
                </div>
              </div>

              {/* CO₂削減量（環境への貢献） */}
              <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🌍</span>
                  <span className="text-2xl font-bold text-green-800">
                    環境への貢献度
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-green-700 mb-2">
                    {resultData.team1.co2Reduction.toFixed(1)} kg
                  </div>
                  <div className="text-lg text-green-700 font-semibold">
                    CO₂を削減しました！
                  </div>
                </div>

                {/* 環境変化の視覚化 */}
                <div className="flex justify-center space-x-8 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="text-4xl mb-2">
                      {team1Environment.forest}
                    </div>
                    <p className="text-sm text-green-600 font-bold">
                      森が元気！
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="text-4xl mb-2">{team1Environment.sky}</div>
                    <p className="text-sm text-blue-600 font-bold">
                      空気がきれい！
                    </p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <div className="text-4xl mb-2">
                      {team1Environment.animals}
                    </div>
                    <p className="text-sm text-yellow-600 font-bold">
                      生き物も元気！
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-green-200">
                  <p className="text-2xl text-green-800 font-bold text-center mb-2">
                    🐄 牛{" "}
                    <span className="text-3xl text-purple-600">
                      {team1Cows}
                    </span>{" "}
                    頭分のCO₂削減！
                  </p>
                  <p className="text-lg text-green-700 text-center">
                    🌱 地球温暖化をしっかり防止しました
                  </p>
                </div>
              </div>

              {/* 幸福度（街の暮らしやすさ） */}
              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">😊</span>
                  <span className="text-2xl font-bold text-purple-800">
                    街の暮らしやすさ
                  </span>
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-purple-700 mb-3">
                    {team1Happiness} 点
                  </div>

                  {/* 幸福度の星表示 */}
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-4xl mx-1 ${
                          team1Happiness >= star * 20
                            ? "text-yellow-400 animate-pulse"
                            : "text-gray-300"
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                {/* 苦情分野別表示 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-100 rounded-xl border-2 border-red-200">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🌿</span>
                      <span className="font-bold text-lg text-red-700">
                        環境問題（CO₂・騒音）
                      </span>
                    </div>
                    <div className="bg-red-200 px-3 py-1 rounded-full">
                      <span className="text-red-800 font-bold text-lg">
                        {resultData.team1.complaints.environment} 件
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-100 rounded-xl border-2 border-orange-200">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">⚡</span>
                      <span className="font-bold text-lg text-orange-700">
                        電力安定性（停電回数）
                      </span>
                    </div>
                    <div className="bg-orange-200 px-3 py-1 rounded-full">
                      <span className="text-orange-800 font-bold text-lg">
                        {resultData.team1.complaints.stability} 件
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-100 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏢</span>
                      <span className="font-bold text-lg text-blue-700">
                        インフラ（家・電車・お店）
                      </span>
                    </div>
                    <div className="bg-blue-200 px-3 py-1 rounded-full">
                      <span className="text-blue-800 font-bold text-lg">
                        {resultData.team1.complaints.infrastructure} 件
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-lg text-purple-700 font-semibold">
                    💡 苦情が少ないほど街の人が幸せです！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* チーム2詳細 */}
          <div>
            <div>
              <section className="flex-1 border rounded-4xl bg-white shadow-2xl p-6 mb-6">
                <PowerLineChart sessionId={"73"} />
              </section>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-red-600 mb-2 flex items-center justify-center">
                  <span className="text-4xl mr-2">🛡️</span>
                  {resultData.team2.teamName}
                  <span className="text-4xl ml-2">🛡️</span>
                </h2>
              </div>

              {/* 総発電量（がんばり度） */}
              <div className="mb-8 p-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl border-2 border-red-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">⚡</span>
                  <span className="text-2xl font-bold text-red-800">
                    総発電量（がんばり度）
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-red-700 mb-2 animate-pulse">
                    {resultData.team2.totalPower.toFixed(1)} kWh
                  </div>
                </div>

                <div className="w-full bg-gray-300 rounded-full h-6 mb-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 h-6 rounded-full transition-all duration-2000 shadow-lg"
                    style={{
                      width: `${Math.min(
                        100,
                        (resultData.team2.totalPower / 150) * 100
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-red-200">
                  <p className="text-2xl text-red-800 font-bold text-center mb-2">
                    🏫 学校{" "}
                    <span className="text-3xl text-green-600">
                      {team2Schools}
                    </span>{" "}
                    校分を動かせる！
                  </p>
                  <p className="text-lg text-red-700 text-center">
                    🌟 小学校1校の1日分の電気 = 約30kWh
                  </p>
                </div>
              </div>

              {/* 最大瞬間発電量（ピークパワー） */}
              <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🚀</span>
                  <span className="text-2xl font-bold text-orange-800">
                    いちばんがんばった瞬間
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-orange-700 mb-2 animate-bounce">
                    {resultData.team2.peakPower.toFixed(1)} kW
                  </div>
                  <div className="text-xl text-orange-700 font-semibold">
                    🕐 {resultData.team2.peakTime} にピーク達成！
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-orange-200">
                  <p className="text-2xl text-orange-800 font-bold text-center mb-2">
                    🏟️ 体育館{" "}
                    <span className="text-3xl text-red-600">{team2Gyms}</span>{" "}
                    個分の電気！
                  </p>
                  <p className="text-lg text-orange-700 text-center">
                    💪 瞬間最大パワーがすごい！
                  </p>
                </div>
              </div>

              {/* CO₂削減量（環境への貢献） */}
              <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🌍</span>
                  <span className="text-2xl font-bold text-green-800">
                    環境への貢献度
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-green-700 mb-2">
                    {resultData.team2.co2Reduction.toFixed(1)} kg
                  </div>
                  <div className="text-lg text-green-700 font-semibold">
                    CO₂を削減しました！
                  </div>
                </div>

                <div className="flex justify-center space-x-8 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="text-4xl mb-2">
                      {team2Environment.forest}
                    </div>
                    <p className="text-sm text-green-600 font-bold">
                      森が元気！
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="text-4xl mb-2">{team2Environment.sky}</div>
                    <p className="text-sm text-blue-600 font-bold">
                      空気がきれい！
                    </p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <div className="text-4xl mb-2">
                      {team2Environment.animals}
                    </div>
                    <p className="text-sm text-yellow-600 font-bold">
                      生き物も元気！
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-green-200">
                  <p className="text-2xl text-green-800 font-bold text-center mb-2">
                    🐄 牛{" "}
                    <span className="text-3xl text-purple-600">
                      {team2Cows}
                    </span>{" "}
                    頭分のCO₂削減！
                  </p>
                  <p className="text-lg text-green-700 text-center">
                    🌱 地球温暖化をしっかり防止しました
                  </p>
                </div>
              </div>

              {/* 幸福度（街の暮らしやすさ） */}
              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">😊</span>
                  <span className="text-2xl font-bold text-purple-800">
                    街の暮らしやすさ
                  </span>
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-purple-700 mb-3">
                    {team2Happiness} 点
                  </div>

                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-4xl mx-1 ${
                          team2Happiness >= star * 20
                            ? "text-yellow-400 animate-pulse"
                            : "text-gray-300"
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-100 rounded-xl border-2 border-red-200">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🌿</span>
                      <span className="font-bold text-lg text-red-700">
                        環境問題（CO₂・騒音）
                      </span>
                    </div>
                    <div className="bg-red-200 px-3 py-1 rounded-full">
                      <span className="text-red-800 font-bold text-lg">
                        {resultData.team2.complaints.environment} 件
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-100 rounded-xl border-2 border-orange-200">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">⚡</span>
                      <span className="font-bold text-lg text-orange-700">
                        電力安定性（停電回数）
                      </span>
                    </div>
                    <div className="bg-orange-200 px-3 py-1 rounded-full">
                      <span className="text-orange-800 font-bold text-lg">
                        {resultData.team2.complaints.stability} 件
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-100 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏢</span>
                      <span className="font-bold text-lg text-blue-700">
                        インフラ（家・電車・お店）
                      </span>
                    </div>
                    <div className="bg-blue-200 px-3 py-1 rounded-full">
                      <span className="text-blue-800 font-bold text-lg">
                        {resultData.team2.complaints.infrastructure} 件
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-lg text-purple-700 font-semibold">
                    💡 苦情が少ないほど街の人が幸せです！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 text-xl"
          >
            🏠 ダッシュボードに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
