"use client";

import { useState, useEffect } from "react";
import { Gauge } from "./Gauge";
import { PowerLineChart } from "./PowerChart";
import { PowerMap } from "./Map";

export default function DashboardPage() {
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [sessionId1, setSessionId1] = useState("");
  const [sessionId2, setSessionId2] = useState("");
  const [isConfigComplete, setIsConfigComplete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 初期ロード時にlocalStorageから値を取得
  useEffect(() => {
    const savedTeam1 = localStorage.getItem("team1Name");
    const savedTeam2 = localStorage.getItem("team2Name");
    const savedSessionId1 = localStorage.getItem("sessionId1");
    const savedSessionId2 = localStorage.getItem("sessionId2");
    const savedConfigComplete = localStorage.getItem("configComplete");

    if (savedTeam1) setTeam1Name(savedTeam1);
    if (savedTeam2) setTeam2Name(savedTeam2);
    if (savedSessionId1) setSessionId1(savedSessionId1);
    if (savedSessionId2) setSessionId2(savedSessionId2);

    // 設定が完了していて、すべての値が保存されている場合のみ完了状態にする
    if (
      savedConfigComplete === "true" &&
      savedTeam1 &&
      savedTeam2 &&
      savedSessionId1 &&
      savedSessionId2
    ) {
      setIsConfigComplete(true);
    }
  }, []);

  // メニューの外側をクリックしたときに閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest(".menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSave = () => {
    if (!team1Name || !team2Name || !sessionId1 || !sessionId2) {
      alert("すべての項目を入力してください");
      return;
    }
    localStorage.setItem("team1Name", team1Name);
    localStorage.setItem("team2Name", team2Name);
    localStorage.setItem("sessionId1", sessionId1);
    localStorage.setItem("sessionId2", sessionId2);
    localStorage.setItem("configComplete", "true");
    setIsConfigComplete(true);
  };

  const handleReset = () => {
    if (
      confirm("設定をリセットしますか？チーム名とセッションIDが削除されます。")
    ) {
      localStorage.removeItem("team1Name");
      localStorage.removeItem("team2Name");
      localStorage.removeItem("sessionId1");
      localStorage.removeItem("sessionId2");
      localStorage.removeItem("configComplete");
      setTeam1Name("");
      setTeam2Name("");
      setSessionId1("");
      setSessionId2("");
      setIsConfigComplete(false);
      setIsMenuOpen(false);
    }
  };

  // 入力ウィンドウが必要かどうか
  const showModal = !isConfigComplete;

  return (
    <div className="relative w-full min-h-screen p-8">
      {/* ハンバーガーメニュー */}
      {isConfigComplete && (
        <div className="fixed top-4 right-4 z-40 menu-container">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-white/90 hover:bg-white border border-gray-300 rounded-lg p-3 shadow-lg transition-all duration-200"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center relative">
              <div
                className={`h-0.5 w-6 bg-gray-600 transition-all duration-300 absolute ${
                  isMenuOpen ? "rotate-45" : "-translate-y-2"
                }`}
              ></div>
              <div
                className={`h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></div>
              <div
                className={`h-0.5 w-6 bg-gray-600 transition-all duration-300 absolute ${
                  isMenuOpen ? "-rotate-45" : "translate-y-2"
                }`}
              ></div>
            </div>
          </button>

          {/* ドロップダウンメニュー */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-xl py-2">
              <button
                onClick={handleReset}
                className="w-full px-4 py-3 text-left hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                設定をリセット
              </button>
            </div>
          )}
        </div>
      )}

      {/* 背景ぼかし & モーダル */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景ブラー + 半透明 */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          {/* モーダル本体 */}
          <div className="relative bg-white/90 rounded-2xl shadow-2xl p-8 w-fit max-w-4xl z-10">
            <h1 className="text-2xl font-bold mb-6 text-center">
              チーム情報を入力してください
            </h1>

            {/* 2チーム横並びレイアウト */}
            <div className="flex gap-8 mb-6">
              {/* Team 1 */}
              <div className="flex-1 min-w-72">
                <h2 className="text-lg font-semibold mb-4 text-center text-blue-600">
                  Team 1
                </h2>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">チーム名</label>
                  <input
                    type="text"
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 寿司"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Session ID</label>
                  <input
                    type="text"
                    value={sessionId1}
                    onChange={(e) => setSessionId1(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: session1"
                  />
                </div>
              </div>

              {/* 区切り線 */}
              <div className="w-px bg-gray-300"></div>

              {/* Team 2 */}
              <div className="flex-1 min-w-72">
                <h2 className="text-lg font-semibold mb-4 text-center text-red-600">
                  Team 2
                </h2>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">チーム名</label>
                  <input
                    type="text"
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="例: 天ぷら"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Session ID</label>
                  <input
                    type="text"
                    value={sessionId2}
                    onChange={(e) => setSessionId2(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="例: session2"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
            >
              決定
            </button>
          </div>
        </div>
      )}

      {/* ダッシュボードコンテンツ - 設定が完了している場合のみ表示 */}
      {isConfigComplete && (
        <div className={showModal ? "pointer-events-none blur-sm" : ""}>
          {/* チーム名表示 */}
          <section className="flex w-full mb-6">
            <div className="flex-1 flex justify-center">
              <p className="border rounded-2xl bg-white text-5xl font-bold px-8 py-4">
                Team {team1Name}
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <p className="border rounded-2xl bg-white text-5xl font-bold px-8 py-4">
                Team {team2Name}
              </p>
            </div>
          </section>

          {/* 発電量表示 */}
          <div className="flex gap-6">
            <section className="w-1/2 flex border rounded-4xl bg-white shadow-2xl p-6">
              <div className="grid grid-cols-4 gap-10 w-full">
                <div className="flex flex-col items-center justify-center">
                  <Gauge deviceType="geothermal" sessionId={sessionId1} />
                  <span className="font-bold text-2xl">地熱発電</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Gauge deviceType="hydrogen" sessionId={sessionId1} />
                  <span className="font-bold text-2xl">ボタン発電</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Gauge deviceType="wind" sessionId={sessionId1} />
                  <span className="font-bold text-2xl">風力発電</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Gauge deviceType="solar" sessionId={sessionId1} />
                  <span className="font-bold text-2xl">太陽光発電</span>
                </div>
              </div>
            </section>
            <section className="w-1/2 flex border rounded-4xl bg-white shadow-2xl p-6">
              <div className="grid grid-cols-4 gap-10 w-full">
                <div className="flex flex-col items-center justify-center">
                  <Gauge deviceType="geothermal" sessionId={sessionId2} />
                  <span className="font-bold text-2xl">地熱発電</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Gauge deviceType="hydrogen" sessionId={sessionId2} />
                  <span className="font-bold text-2xl">ボタン発電</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Gauge deviceType="wind" sessionId={sessionId2} />
                  <span className="font-bold text-2xl">風力発電</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Gauge deviceType="solar" sessionId={sessionId2} />
                  <span className="font-bold text-2xl">太陽光発電</span>
                </div>
              </div>
            </section>
          </div>

          {/* グラフ */}
          <div className="flex gap-6 mb-6 mt-6">
            <section className="flex-1 border rounded-4xl bg-white shadow-2xl p-6 mb-6">
              <PowerLineChart sessionId={sessionId1} />
            </section>
            <section className="flex-1 border rounded-4xl bg-white shadow-2xl p-6 mb-6">
              <PowerLineChart sessionId={sessionId2} />
            </section>
          </div>

          {/* 地図 */}
          <div className="flex gap-6 mb-6 mt-6">
            <section className="border rounded-4xl bg-white shadow-2xl p-6 mb-6 flex-1">
              <PowerMap mapId="map1" sessionId={sessionId1} />
            </section>
            <section className="border rounded-4xl bg-white shadow-2xl p-6 mb-6 flex-1">
              <PowerMap mapId="map2" sessionId={sessionId2} />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
