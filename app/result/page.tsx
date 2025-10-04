"use client";

import { useState, useEffect } from "react";
import { PowerLineChart } from "../dashboard/PowerChart";

interface ResultData {
  team1: GameResult;
  team2: GameResult;
}

export interface GameResult {
  totalPowerGeneration: number;
  hydrogenMaximumInstantaneousPowerGeneration: number;
  windMaximumInstantaneousPowerGeneration: number;
  solarMaximumInstantaneousPowerGeneration: number;
  geothermalMaximumInstantaneousPowerGeneration: number;
  co2ReductionAmount: number;
  happiness: {
    environmentProblemScore: number;
    environmentProblemNumber: number;
    powerStabilityScore: number;
    powerStabilityNumber: number;
    infrastructureComfortScore: number;
    infrastructureComfortNumber: number;
  };
}

function ComplaintRow({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: "red" | "orange" | "blue";
}) {
  const colorClasses: Record<typeof color, string> = {
    red: "bg-red-100 border-red-200 text-red-700",
    orange: "bg-orange-100 border-orange-200 text-orange-700",
    blue: "bg-blue-100 border-blue-200 text-blue-700",
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border-2 ${colorClasses[color]}`}
    >
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        <span className="font-bold text-lg">{label}</span>
      </div>
      <div className="px-3 py-1 rounded-full bg-white bg-opacity-40">
        <span className="font-bold text-lg">{value} 件</span>
      </div>
    </div>
  );
}

function TeamResultCard({
  sessionId,
  color,
  gameResultData,
}: {
  sessionId: string;
  color: "blue" | "red";
  gameResultData?: GameResult;
}) {
  return (
    <div>
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
        {/* チーム名 */}
        <div className="text-center mb-6">
          <h2
            className={`text-3xl font-bold ${
              color === "blue" ? "text-blue-600" : "text-red-600"
            } mb-2`}
          >
            Team {gameResultData?.totalPowerGeneration}
          </h2>
        </div>

        {/* 総発電量 */}
        <div
          className={`mb-8 p-6 rounded-2xl border-2 ${
            color === "blue"
              ? "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300"
              : "bg-gradient-to-r from-red-100 to-pink-100 border-red-300"
          }`}
        >
          <span
            className={`text-2xl font-bold ${
              color === "blue" ? "text-blue-800" : "text-red-800"
            }`}
          >
            総発電量(kWh)
          </span>
          <div className="text-center mb-4">
            <div
              className={`text-5xl font-bold mb-2  ${
                color === "blue" ? "text-blue-700" : "text-red-700"
              }`}
            >
              {gameResultData?.totalPowerGeneration.toFixed(3)} kW
            </div>
          </div>
        </div>

        {/* 最大瞬間発電量 */}
        <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300">
          <span className="text-2xl font-bold text-orange-800">
            最大瞬間発電量
          </span>
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-700">kW</div>
          </div>
        </div>

        {/* CO₂削減量 */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300">
          <span className="text-2xl font-bold text-green-800">CO₂削減量</span>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-700">kw</div>
          </div>
        </div>

        {/* 幸福度 */}
        <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300">
          <span className="text-2xl font-bold text-purple-800">
            街の暮らしやすさ
          </span>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-700 mb-3"></div>
          </div>

          <div className="space-y-3">
            <ComplaintRow
              icon="🌿"
              label="環境問題（CO₂・騒音）"
              value={3}
              color="red"
            />
            <ComplaintRow
              icon="⚡"
              label="電力安定性（停電回数）"
              value={3}
              color="orange"
            />
            <ComplaintRow
              icon="🏢"
              label="インフラ（家・電車・お店）"
              value={3}
              color="blue"
            />
          </div>
        </div>
      </div>

      {/* グラフ */}
      <section className="flex-1 border rounded-4xl bg-white shadow-2xl p-6 mt-6">
        <PowerLineChart sessionId={sessionId} />
      </section>
    </div>
  );
}

export default function ResultPage() {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId1, setSessionId1] = useState<string>("default_session");
  const [sessionId2, setSessionId2] = useState<string>("default_session");

  useEffect(() => {
    const sessionId1 = localStorage.getItem("sessionId1") || "default_session";
    const sessionId2 = localStorage.getItem("sessionId2") || "default_session";
    setSessionId1(sessionId1);
    setSessionId2(sessionId2);
    const fetchResultData = async () => {
      try {
        const res1 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-game-result?session_id=${sessionId1}`
        );
        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-game-result?session_id=${sessionId2}`
        );

        if (!res1.ok) throw new Error(`API1 error: ${res1.status}`);
        if (!res2.ok) throw new Error(`API2 error: ${res2.status}`);

        const data1: GameResult = await res1.json();
        const data2: GameResult = await res2.json();

        setResultData({ team1: data1, team2: data2 });
      } catch {
        setError("データ取得失敗");
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, []);

  // --- スピナー付きローディング画面 ---
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[rgb(194,238,112)] to-[rgb(60,223,156)]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold text-gray-700">ロード中...</p>
        </div>
      </div>
    );

  if (error || !resultData) return <div>エラー: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgb(194,238,112)] to-[rgb(60,223,156)] p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TeamResultCard
          sessionId={sessionId1}
          color="blue"
          gameResultData={resultData.team1}
        />
        <TeamResultCard
          sessionId={sessionId2}
          color="red"
          gameResultData={resultData.team2}
        />
      </div>
      <div className="text-center">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-gradient-to-r bg-white text-black font-bold py-4 px-10 rounded-full shadow-2xl transform hover:scale-110  duration-300 text-xl"
        >
          ダッシュボードに戻る
        </button>
      </div>
    </div>
  );
}
