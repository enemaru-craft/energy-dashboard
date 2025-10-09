"use client";

import { useState } from "react";

export default function DeleteSessionPage() {
  const [sessionId, setSessionId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionId.trim()) {
      setMessage("セッションIDを入力してください");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/delete-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: sessionId,
            password: password,
          }),
        }
      );

      if (response.ok) {
        setMessage("セッションが正常に削除されました");
        setMessageType("success");
        setSessionId("");
        setPassword("");
      } else {
        const errorData = await response.text();
        setMessage(`削除に失敗しました: ${errorData}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Delete session error:", error);
      if (error instanceof Error) {
        if (error.message.includes("CORS") || error.message.includes("fetch")) {
          setMessage(
            `ネットワークエラー: ${error.message}。CORS設定またはサーバー接続を確認してください。`
          );
        } else {
          setMessage(`エラーが発生しました: ${error.message}`);
        }
      } else {
        setMessage("不明なエラーが発生しました");
      }
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgb(194,238,112)] to-[rgb(60,223,156)] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          セッション削除
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* セッションID入力 */}
          <div>
            <label
              htmlFor="sessionId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              セッションID
            </label>
            <input
              type="text"
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
              placeholder="セッションIDを入力"
              disabled={isLoading}
            />
          </div>

          {/* パスワード入力 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
              placeholder="パスワードを入力"
              disabled={isLoading}
            />
          </div>

          {/* メッセージ表示 */}
          {message && (
            <div
              className={`p-4 rounded-xl text-center font-medium ${
                messageType === "success"
                  ? "bg-green-100 text-green-800 border-2 border-green-200"
                  : "bg-red-100 text-red-800 border-2 border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* 削除ボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
              isLoading
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg transform hover:scale-105"
            }`}
          >
            {isLoading ? "削除中..." : "セッションを削除"}
          </button>
        </form>

        {/* 戻るボタン */}
        <div className="mt-6 text-center">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
