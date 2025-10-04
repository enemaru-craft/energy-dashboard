"use client";

import { useState, useEffect } from "react";
import { ResultPowerLineChart } from "./ResultPowerChart";

interface ResultData {
  team1: GameResult;
  team2: GameResult;
}

interface GameResult {
  totalPowerGeneration: number;
  geothermalMaximumInstantaneousPowerGeneration: number;
  solarMaximumInstantaneousPowerGeneration: number;
  co2ReductionAmount: number;
  windMaximumInstantaneousPowerGeneration: number;
  hydrogenMaximumInstantaneousPowerGeneration: number;
  happiness: {
    environmentProblemScore: number;
    economyProblemScore: number;
    securityProblemScore: number;
    environmentProblemNumber: number;
    economyProblemNumber: number;
    securityProblemNumber: number;
    powerStabilityScore: number;
    powerStabilityNumber: number;
    infrastructureComfortScore: number;
    infrastructureComfortNumber: number;
  };
  villagersTexts: {
    [facilityName: string]: string;
  };
}

interface VillagerTextProps {
  facilityName: string;
  message: string;
}

const VillagerText = ({ facilityName, message }: VillagerTextProps) => (
  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
    <div className="flex items-center mb-2">
      <div className="font-bold text-lg text-purple-700">{facilityName}</div>
    </div>
    <div className="text-xl leading-relaxed text-purple-600 bg-white bg-opacity-50 rounded-lg p-3">
      {message}
    </div>
  </div>
);

function ComplaintRow({
  icon,
  label,
  score,
  complaintsCount,
  color,
}: {
  icon: string;
  label: string;
  score: number;
  complaintsCount: number;
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
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 rounded-full bg-white bg-opacity-40 min-w-[140px] text-center">
          <span className="font-bold text-base">
            スコア: {score.toFixed(1)}
          </span>
        </div>
        <div className="px-4 py-2 rounded-full bg-white bg-opacity-40 min-w-[90px] text-center">
          <span className="font-bold text-base">{complaintsCount} 件</span>
        </div>
      </div>
    </div>
  );
}

function TeamResultCard({
  sessionId,
  teamName,
  color,
  gameResultData,
  animationStep = 0,
}: {
  sessionId: string;
  teamName: string;
  color: "blue" | "red";
  gameResultData?: GameResult;
  animationStep?: number;
}) {
  return (
    <div>
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
        {/* チーム名 */}
        <div
          className={`text-center mb-6 transform transition-all duration-700 ${
            animationStep >= 0
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <h2
            className={`text-3xl font-bold ${
              color === "blue" ? "text-blue-600" : "text-red-600"
            } mb-2`}
          >
            Team {teamName}
          </h2>
        </div>

        {/* 総発電量 */}
        <div
          className={`mb-8 p-6 rounded-2xl border-2 transform transition-all duration-700 delay-300 ${
            animationStep >= 1
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          } ${
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
              {gameResultData?.totalPowerGeneration.toFixed(3)} kWh
            </div>
          </div>
        </div>

        {/* 最大瞬間発電量 */}
        <div
          className={`mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300 transform transition-all duration-700 delay-600 ${
            animationStep >= 2
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          <span className="text-2xl font-bold text-orange-800 mb-4 block">
            最大瞬間発電量
          </span>

          <div className="grid grid-cols-2 gap-4">
            {/* 地熱発電 */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
              <div className="text-red-600 text-lg mb-2">地熱</div>
              <div className="text-2xl font-bold text-red-700">
                {gameResultData?.geothermalMaximumInstantaneousPowerGeneration?.toFixed(
                  2
                ) || "0.00"}{" "}
                kW
              </div>
            </div>

            {/* 太陽光発電 */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
              <div className="text-yellow-600 text-lg mb-2">太陽光</div>
              <div className="text-2xl font-bold text-yellow-700">
                {gameResultData?.solarMaximumInstantaneousPowerGeneration?.toFixed(
                  2
                ) || "0.00"}{" "}
                kW
              </div>
            </div>

            {/* 風力発電 */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
              <div className="text-green-600 text-lg mb-2">風力</div>
              <div className="text-2xl font-bold text-green-700">
                {gameResultData?.windMaximumInstantaneousPowerGeneration?.toFixed(
                  2
                ) || "0.00"}{" "}
                kW
              </div>
            </div>

            {/* 人力発電 */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
              <div className="text-blue-600 text-lg mb-2">人力</div>
              <div className="text-2xl font-bold text-blue-700">
                {gameResultData?.hydrogenMaximumInstantaneousPowerGeneration?.toFixed(
                  2
                ) || "0.00"}{" "}
                kW
              </div>
            </div>
          </div>
        </div>

        {/* CO₂排出量 */}
        <div
          className={`mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300 transform transition-all duration-700 delay-900 ${
            animationStep >= 3
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          <span className="text-2xl font-bold text-green-800">CO₂排出量</span>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-700">
              {gameResultData?.co2ReductionAmount?.toFixed(2) || "0.00"} kg
            </div>
          </div>
        </div>

        {/* 幸福度 */}
        <div
          className={`p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300 transform transition-all duration-700 delay-1200 ${
            animationStep >= 4
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          <span className="text-2xl font-bold text-purple-800">
            街の暮らしやすさ
          </span>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-700 mb-3"></div>
          </div>

          <div className="space-y-3 mb-6">
            <ComplaintRow
              icon="🌿"
              label="環境問題（CO₂・騒音）"
              score={gameResultData?.happiness.environmentProblemScore || 0}
              complaintsCount={
                gameResultData?.happiness.environmentProblemNumber || 0
              }
              color="red"
            />
            <ComplaintRow
              icon="⚡"
              label="電力安定性（停電回数）"
              score={gameResultData?.happiness.powerStabilityScore || 0}
              complaintsCount={
                gameResultData?.happiness.powerStabilityNumber || 0
              }
              color="orange"
            />
            <ComplaintRow
              icon="🏢"
              label="インフラ（家・電車・お店）"
              score={gameResultData?.happiness.infrastructureComfortScore || 0}
              complaintsCount={
                gameResultData?.happiness.infrastructureComfortNumber || 0
              }
              color="blue"
            />
          </div>

          {/* 村人の声 */}
          {gameResultData?.villagersTexts && (
            <div>
              <h4 className="text-lg font-bold text-purple-800 mb-3">
                村人の声
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {gameResultData.villagersTexts.facility_firestation && (
                  <VillagerText
                    facilityName="消防署"
                    message={gameResultData.villagersTexts.facility_firestation}
                  />
                )}
                {gameResultData.villagersTexts.facility_shoppingmall && (
                  <VillagerText
                    facilityName="ショッピングモール"
                    message={
                      gameResultData.villagersTexts.facility_shoppingmall
                    }
                  />
                )}
                {gameResultData.villagersTexts.factory && (
                  <VillagerText
                    facilityName="工場"
                    message={gameResultData.villagersTexts.factory}
                  />
                )}
                {gameResultData.villagersTexts.house && (
                  <VillagerText
                    facilityName="住宅"
                    message={gameResultData.villagersTexts.house}
                  />
                )}
                {gameResultData.villagersTexts.light && (
                  <VillagerText
                    facilityName="街灯"
                    message={gameResultData.villagersTexts.light}
                  />
                )}
                {gameResultData.villagersTexts.train && (
                  <VillagerText
                    facilityName="電車"
                    message={gameResultData.villagersTexts.train}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* グラフ */}
      <section
        className={`flex-1 border rounded-4xl bg-white shadow-2xl p-6 mt-6 transform transition-all duration-700 delay-1500 ${
          animationStep >= 5
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        <ResultPowerLineChart sessionId={sessionId} />
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
  const [teamName1, setTeamName1] = useState<string>("Team 1");
  const [teamName2, setTeamName2] = useState<string>("Team 2");
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const sessionId1 = localStorage.getItem("sessionId1") || "default_session";
    const sessionId2 = localStorage.getItem("sessionId2") || "default_session";
    const teamName1 = localStorage.getItem("team1Name") || "Team 1";
    const teamName2 = localStorage.getItem("team2Name") || "Team 2";
    setSessionId1(sessionId1);
    setSessionId2(sessionId2);
    setTeamName1(teamName1);
    setTeamName2(teamName2);
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

  // アニメーション制御
  useEffect(() => {
    if (!loading && resultData) {
      const steps = [0, 1, 2, 3, 4, 5];
      steps.forEach((step, index) => {
        setTimeout(() => {
          setAnimationStep(step);
        }, index * 500); // 0.5秒間隔で順番に表示
      });
    }
  }, [loading, resultData]);

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
          teamName={teamName1}
          color="blue"
          gameResultData={resultData.team1}
          animationStep={animationStep}
        />
        <TeamResultCard
          sessionId={sessionId2}
          teamName={teamName2}
          color="red"
          gameResultData={resultData.team2}
          animationStep={animationStep}
        />
      </div>
      <div
        className={`text-center transform transition-all duration-700 delay-1800 ${
          animationStep >= 5
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
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
