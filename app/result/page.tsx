"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import { ResultPowerLineChart } from "./ResultPowerChart";

interface ResultData {
  team1: GameResult;
  team2: GameResult;
}

interface CommentWithSentiment {
  text: string;
  sentiment: "positive" | "negative";
}

interface GameResult {
  totalPowerGeneration: number;
  geothermalMaximumInstantaneousPowerGeneration: number;
  solarMaximumInstantaneousPowerGeneration: number;
  co2ReductionAmount: number;
  windMaximumInstantaneousPowerGeneration: number;
  hydrogenMaximumInstantaneousPowerGeneration: number;
  geothermalTotalPower: number;
  fireTotalPower: number;
  windTotalPower: number;
  solarTotalPower: number;
  hydrogenTotalPower: number;
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
    environmentProblemComment: CommentWithSentiment;
    powerStabilityComment: CommentWithSentiment;
    infrastructureComfortComment: CommentWithSentiment;
  };
  villagersTexts: {
    [facilityName: string]: CommentWithSentiment;
  };
}

const VillagerText = ({ message }: { message: CommentWithSentiment }) => (
  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
    <div className="text-xl leading-relaxed text-purple-600 bg-white bg-opacity-50 rounded-lg p-3">
      {message.text}
    </div>
  </div>
);

// Pie chart summarizing power generation shares
const PowerGenerationPieChart = ({
  gameResultData,
  color,
}: {
  gameResultData?: GameResult;
  color: "blue" | "red";
}) => {
  const { t } = useLanguage();
  if (!gameResultData) return null;

  const data = [
    {
      name: t("energy.geothermal"),
      value: gameResultData.geothermalTotalPower || 0,
      color: "#ef4444",
    },
    {
      name: t("energy.solar"),
      value: gameResultData.solarTotalPower || 0,
      color: "#f59e0b",
    },
    {
      name: t("energy.wind"),
      value: gameResultData.windTotalPower || 0,
      color: "#10b981",
    },
    {
      name: t("energy.hydrogen"),
      value: gameResultData.hydrogenTotalPower || 0,
      color: "#3b82f6",
    },
    {
      name: t("energy.fireShort"),
      value: gameResultData.fireTotalPower || 0,
      color: "#dc2626",
    },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;

  let cumulativeAngle = 0;

  return (
    <div
      className={`rounded-2xl shadow-md p-6 border-2 ${
        color === "blue"
          ? "bg-[rgb(200,247,254)] border-blue-300"
          : "bg-[rgb(253,226,238)] border-red-300"
      }`}
    >
      <h3
        className={`text-xl font-bold mb-4 text-center ${
          color === "blue" ? "text-blue-800" : "text-red-800"
        }`}
      >
        {t("result.summary.energyMixTitle")}
      </h3>
      <div className="flex flex-col items-center">
        <svg width="200" height="200" className="mb-4">
          {data.map((item, index) => {
            if (item.value === 0) return null;

            const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;

            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

            const largeArc = angle > 180 ? 1 : 0;

            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
              `Z`,
            ].join(" ");

            cumulativeAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          <circle cx="100" cy="100" r="30" fill="white" />
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="text-sm font-bold fill-gray-700"
          >
            {t("result.summary.energyMixTotal")}
          </text>
          <text
            x="100"
            y="110"
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {total.toFixed(1)}kWh
          </text>
        </svg>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {data.map((item, index) => {
            if (item.value === 0) return null;
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 text-xs">
                  {item.name}: {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Typings for canvas-confetti script
declare global {
  interface Window {
    confetti: (options?: {
      particleCount?: number;
      angle?: number;
      spread?: number;
      startVelocity?: number;
      colors?: string[];
      origin?: { x?: number; y?: number };
    }) => void;
  }
}

// Confetti animation component
const CrackerAnimation = ({ show }: { show: boolean }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Dynamically load the canvas-confetti script
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!document.querySelector('script[src*="canvas-confetti"]')) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.2/dist/confetti.browser.min.js";
        script.onload = () => {
          setIsScriptLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setIsScriptLoaded(true);
      }
    }
  }, []);

  // Trigger confetti animation sequences
  useEffect(() => {
    if (!show || !isScriptLoaded || !window.confetti) return;

    const runConfetti = () => {
      // Base burst from the center
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Burst from the left edge
      setTimeout(() => {
        window.confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
        });
      }, 200);

      // Burst from the right edge
      setTimeout(() => {
        window.confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
        });
      }, 400);

      // Golden burst cascading from the top
      setTimeout(() => {
        window.confetti({
          particleCount: 30,
          spread: 360,
          startVelocity: 30,
          colors: ["#FFD700", "#FFA500", "#FF6347"],
          origin: { x: 0.5, y: 0.3 },
        });
      }, 600);

      // Continuous small bursts for sparkle
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        window.confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        window.confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      setTimeout(() => {
        frame();
      }, 800);
    };

    runConfetti();
  }, [show, isScriptLoaded]);

  // canvas-confetti renders directly, so no JSX element is required
  return null;
};

function ComplaintRow({
  icon,
  label,
  score,
  complaintsCount,
  color,
  comment,
}: {
  icon: string;
  label: string;
  score: number;
  complaintsCount: number;
  color: "red" | "orange" | "blue";
  comment?: string;
}) {
  const { t } = useLanguage();
  const colorClasses: Record<typeof color, string> = {
    red: "bg-red-100 border-red-200 text-red-700",
    orange: "bg-orange-100 border-orange-200 text-orange-700",
    blue: "bg-blue-100 border-blue-200 text-blue-700",
  };

  return (
    <div className={`p-3 rounded-xl border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <span className="font-bold text-lg">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-full bg-white bg-opacity-40 min-w-[140px] text-center">
            <span className="font-bold text-base">
              {t("result.team.scoreLabel")} {score.toFixed(1)}
            </span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white bg-opacity-40 min-w-[90px] text-center">
            <span className="font-bold text-base">
              {t("result.team.complaintCount", { count: complaintsCount })}
            </span>
          </div>
        </div>
      </div>
      {comment && (
        <div className="mt-2 px-3 py-2 bg-white bg-opacity-50 rounded-lg flex items-start gap-2">
          <span className="text-lg">💬</span>
          <span className="text-xl font-medium">
            {t("result.team.commentQuote", { comment })}
          </span>
        </div>
      )}
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
  const { t } = useLanguage();
  // Select villager comments by sentiment for display
  const selectedComments = useMemo(() => {
    if (!gameResultData?.villagersTexts) return { left: null, right: null };

    const comments: CommentWithSentiment[] = [];
    if (gameResultData.villagersTexts.facility_firestation) {
      comments.push(gameResultData.villagersTexts.facility_firestation);
    }
    if (gameResultData.villagersTexts.facility_shoppingmall) {
      comments.push(gameResultData.villagersTexts.facility_shoppingmall);
    }
    if (gameResultData.villagersTexts.factory) {
      comments.push(gameResultData.villagersTexts.factory);
    }
    if (gameResultData.villagersTexts.house) {
      comments.push(gameResultData.villagersTexts.house);
    }
    if (gameResultData.villagersTexts.light) {
      comments.push(gameResultData.villagersTexts.light);
    }
    if (gameResultData.villagersTexts.train) {
      comments.push(gameResultData.villagersTexts.train);
    }

    // Split comments based on sentiment buckets
    const positiveComments = comments.filter(
      (comment) => comment.sentiment === "positive"
    );
    const negativeComments = comments.filter(
      (comment) => comment.sentiment === "negative"
    );

    let leftComment = null;
    let rightComment = null;

    // Put a positive comment on the left when we have one
    if (positiveComments.length > 0) {
      leftComment =
        positiveComments[Math.floor(Math.random() * positiveComments.length)];
    }

    // Put a negative comment on the right if we have one
    if (negativeComments.length > 0) {
      rightComment =
        negativeComments[Math.floor(Math.random() * negativeComments.length)];
    }

    // Fallback when either sentiment bucket is empty
    if (positiveComments.length === 0 && negativeComments.length > 0) {
      // If we only have negative comments, mirror them on both sides
      leftComment =
        negativeComments[Math.floor(Math.random() * negativeComments.length)];
      if (negativeComments.length > 1) {
        let rightIndex;
        do {
          rightIndex = Math.floor(Math.random() * negativeComments.length);
        } while (
          negativeComments[rightIndex] === leftComment &&
          negativeComments.length > 1
        );
        rightComment = negativeComments[rightIndex];
      } else {
        rightComment = leftComment;
      }
    } else if (negativeComments.length === 0 && positiveComments.length > 0) {
      // If only positive comments exist, duplicate them for both slots
      rightComment =
        positiveComments[Math.floor(Math.random() * positiveComments.length)];
      if (positiveComments.length > 1) {
        let leftIndex;
        do {
          leftIndex = Math.floor(Math.random() * positiveComments.length);
        } while (
          positiveComments[leftIndex] === rightComment &&
          positiveComments.length > 1
        );
        leftComment = positiveComments[leftIndex];
      } else {
        leftComment = rightComment;
      }
    } else {
      // Ensure both slots are filled when only one comment was assigned
      if (!leftComment && rightComment) {
        leftComment = rightComment;
      }
      if (!rightComment && leftComment) {
        rightComment = leftComment;
      }
    }

    return { left: leftComment, right: rightComment };
  }, [gameResultData?.villagersTexts]);

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
        {/* Team heading */}
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

        {/* Total power summary and pie chart */}
        <div
          className={`mb-8 flex gap-6 transform transition-all duration-700 delay-300 ${
            animationStep >= 1
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          {/* Total power card */}
          <div
            className={`flex-1 p-6 rounded-2xl border-2 flex flex-col justify-center ${
              color === "blue"
                ? "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300"
                : "bg-gradient-to-r from-red-100 to-pink-100 border-red-300"
            }`}
          >
            <span
              className={`text-2xl font-bold text-center block mb-4 ${
                color === "blue" ? "text-blue-800" : "text-red-800"
              }`}
            >
              {t("result.summary.totalPowerLabel")}
            </span>
            <div className="text-center">
              <div
                className={`text-5xl font-bold ${
                  color === "blue" ? "text-blue-700" : "text-red-700"
                }`}
              >
                {gameResultData?.totalPowerGeneration.toFixed(3)} kWh
              </div>
            </div>
          </div>

          {/* Energy mix pie chart */}
          <div className="flex-shrink-0">
            <PowerGenerationPieChart
              gameResultData={gameResultData}
              color={color}
            />
          </div>
        </div>

        {/* Peak output panel */}
        <div
          className={`mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300 transform transition-all duration-700 delay-600 ${
            animationStep >= 2
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          <span className="text-2xl font-bold text-orange-800 mb-4 block">
            {t("result.summary.maxInstantTitle")}
          </span>

          <div className="grid grid-cols-2 gap-4">
            {/* Geothermal block */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
              <div className="text-red-600 text-lg mb-2">
                {t("energy.geothermal")}
              </div>
              <div className="text-2xl font-bold text-red-700">
                {gameResultData?.geothermalMaximumInstantaneousPowerGeneration?.toFixed(
                  2
                ) || "0.00"}{" "}
                kW
              </div>
            </div>

            {/* Solar block */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
              <div className="text-yellow-600 text-lg mb-2">
                {t("energy.solar")}
              </div>
              <div className="text-2xl font-bold text-yellow-700">
                {gameResultData?.solarMaximumInstantaneousPowerGeneration?.toFixed(
                  2
                ) || "0.00"}{" "}
                kW
              </div>
            </div>

            {/* Wind block */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
              <div className="text-green-600 text-lg mb-2">
                {t("energy.wind")}
              </div>
              <div className="text-2xl font-bold text-green-700">
                {gameResultData?.windMaximumInstantaneousPowerGeneration?.toFixed(
                  2
                ) || "0.00"}{" "}
                kW
              </div>
            </div>

            {/* Human power block */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
              <div className="text-blue-600 text-lg mb-2">
                {t("energy.hydrogen")}
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {gameResultData?.hydrogenMaximumInstantaneousPowerGeneration?.toFixed(
                  2
                ) || "0.00"}{" "}
                kW
              </div>
            </div>
          </div>
        </div>

        {/* CO₂ reduction */}
        <div
          className={`mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300 transform transition-all duration-700 delay-900 ${
            animationStep >= 3
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          <span className="text-2xl font-bold text-green-800">
            {t("result.team.co2Title")}
          </span>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-700">
              {gameResultData?.co2ReductionAmount?.toFixed(2) || "0.00"} kg
            </div>
          </div>
        </div>

        {/* Town comfort summary */}
        <div
          className={`p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300 transform transition-all duration-700 delay-1200 ${
            animationStep >= 4
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
        >
          <span className="text-2xl font-bold text-purple-800">
            {t("result.team.happinessTitle")}
          </span>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-700 mb-3"></div>
          </div>

          <div className="space-y-3 mb-6">
            <ComplaintRow
              icon="🌿"
              label={t("result.team.happiness.environment")}
              score={gameResultData?.happiness.environmentProblemScore || 0}
              complaintsCount={
                gameResultData?.happiness.environmentProblemNumber || 0
              }
              color="red"
              comment={
                gameResultData?.happiness.environmentProblemComment?.text
              }
            />
            <ComplaintRow
              icon="⚡"
              label={t("result.team.happiness.power")}
              score={gameResultData?.happiness.powerStabilityScore || 0}
              complaintsCount={
                gameResultData?.happiness.powerStabilityNumber || 0
              }
              color="orange"
              comment={gameResultData?.happiness.powerStabilityComment?.text}
            />
            <ComplaintRow
              icon="🏢"
              label={t("result.team.happiness.infrastructure")}
              score={gameResultData?.happiness.infrastructureComfortScore || 0}
              complaintsCount={
                gameResultData?.happiness.infrastructureComfortNumber || 0
              }
              color="blue"
              comment={
                gameResultData?.happiness.infrastructureComfortComment?.text
              }
            />
          </div>

          {/* Villager feedback snippets */}
          {gameResultData?.villagersTexts &&
            (selectedComments.left || selectedComments.right) && (
              <div>
                <h4 className="text-lg font-bold text-purple-800 mb-3">
                  {t("result.team.additionalVoices")}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedComments.left && (
                    <VillagerText
                      key="positive-comment"
                      message={selectedComments.left}
                    />
                  )}
                  {selectedComments.right && (
                    <VillagerText
                      key="negative-comment"
                      message={selectedComments.right}
                    />
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Power chart */}
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
  const { t } = useLanguage();
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId1, setSessionId1] = useState<string>("default_session");
  const [sessionId2, setSessionId2] = useState<string>("default_session");
  const [teamName1, setTeamName1] = useState<string>("Team 1");
  const [teamName2, setTeamName2] = useState<string>("Team 2");
  const [animationStep, setAnimationStep] = useState(0);
  const [showCracker, setShowCracker] = useState(false);

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
        setError(t("result.page.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [t]);

  // Animation timeline control
  useEffect(() => {
    if (!loading && resultData) {
      const steps = [0, 1, 2, 3, 4, 5];
      steps.forEach((step, index) => {
        setTimeout(() => {
          setAnimationStep(step);
        }, index * 500); // Stagger each reveal by 0.5 seconds
      });

      // Reveal confetti once every animation block finishes
      setTimeout(() => {
        setShowCracker(true);
        // Hide the confetti overlay after five seconds
        setTimeout(() => {
          setShowCracker(false);
        }, 5000);
      }, steps.length * 500 + 1000); // One second after all animations end
    }
  }, [loading, resultData]);

  // --- Loading screen with spinner ---
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[rgb(194,238,112)] to-[rgb(60,223,156)]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold text-gray-700">
            {t("result.page.loading")}
          </p>
        </div>
      </div>
    );

  if (error || !resultData)
    return (
      <div>
        {t("result.page.error")}: {error}
      </div>
    );

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
          {t("result.page.backButton")}
        </button>
      </div>

      {/* Confetti animation */}
      <CrackerAnimation show={showCracker} />
    </div>
  );
}
