"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Language = "ja" | "en";

type TranslationVariables = Record<string, string | number>;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, variables?: TranslationVariables) => string;
};

const translations = {
  ja: {
    "dashboard.alert.fillAll": "すべての項目を入力してください",
    "dashboard.confirm.reset":
      "設定をリセットしますか？チーム名とセッションIDが削除されます。",
    "dashboard.menu.goResult": "リザルト画面へ",
    "dashboard.menu.reset": "設定をリセット",
    "dashboard.menu.switchToEnglish": "English に切り替える",
    "dashboard.menu.switchToJapanese": "日本語に切り替える",
    "dashboard.modal.title": "チーム情報を入力してください",
    "dashboard.modal.teamHeading": "チーム {teamNumber}",
    "dashboard.modal.teamNameLabel": "チーム名",
    "dashboard.modal.sessionIdLabel": "Session ID",
    "dashboard.modal.teamNamePlaceholder1": "例: 寿司",
    "dashboard.modal.teamNamePlaceholder2": "例: 天ぷら",
    "dashboard.modal.sessionPlaceholder1": "例: session1",
    "dashboard.modal.sessionPlaceholder2": "例: session2",
    "dashboard.modal.submit": "決定",
    "dashboard.section.teamTitle": "チーム {teamName}",
    "energy.geothermal": "地熱発電",
    "energy.hydrogen": "人力発電",
    "energy.wind": "風力発電",
    "energy.solar": "太陽光発電",
    "energy.geothermalShort": "地熱",
    "energy.hydrogenShort": "人力発電",
    "energy.windShort": "風力",
    "energy.solarShort": "太陽光",
    "energy.fireShort": "火力",
    "chart.buttons.start": "スタート",
    "chart.buttons.stop": "ストップ",
    "chart.buttons.clear": "クリア",
    "chart.buttons.fullView": "全体表示",
    "chart.totalPower": "総発電量 {value}kWh",
    "chart.filterLabel": "表示開始時刻:",
    "chart.filterPlaceholder": "例: 14:30:00",
    "chart.loading": "データを読み込み中です...",
    "chart.errorTitle": "エラーが発生しました",
    "chart.resultLoading": "グラフデータを読み込み中です...",
    "chart.resultErrorTitle": "グラフデータの取得に失敗しました",
    "chart.noData": "グラフデータがありません",
    "chart.title": "各モジュールにおける発電能力の推移",
    "chart.axis.power": "発電能力(kW)",
    "chart.axis.time": "時間",
    "result.summary.energyMixTitle": "発電割合",
    "result.summary.energyMixTotal": "合計",
    "result.summary.totalPowerLabel": "総発電量(kWh)",
    "result.summary.maxInstantTitle": "最大瞬間発電量",
    "result.pie.title": "でんきのわりあい",
    "result.pie.totalLabel": "ぜんぶで",
    "result.team.heading": "チーム {teamName}",
    "result.team.totalPowerTitle": "みんなでつくったでんき",
    "result.team.totalPowerNote": "（kWh の合計）",
    "result.team.maxInstantTitle": "最大瞬間発電量",
    "result.team.co2Title": "CO₂削減量",
    "result.team.happinessTitle": "街の暮らしやすさ",
    "result.team.happiness.environment": "環境問題（CO₂・騒音）",
    "result.team.happiness.power": "電力安定性（停電回数）",
    "result.team.happiness.infrastructure": "インフラ（家・電車・お店）",
    "result.team.additionalVoices": "その他の声",
    "result.team.scoreLabel": "スコア:",
    "result.team.complaintCount": "{count} 件",
    "result.team.commentQuote": "「{comment}」",
    "result.page.loading": "ロード中...",
    "result.page.error": "エラー",
    "result.page.backButton": "ダッシュボードに戻る",
    "result.villagerTitle": "村人の声",
    "result.page.fetchError": "データ取得に失敗しました",
  },
  en: {
    "dashboard.alert.fillAll": "Please fill in every field.",
    "dashboard.confirm.reset":
      "Reset settings? Team names and session IDs will be cleared.",
    "dashboard.menu.goResult": "Go to result screen",
    "dashboard.menu.reset": "Reset settings",
    "dashboard.menu.switchToEnglish": "Switch to English",
    "dashboard.menu.switchToJapanese": "Switch to Japanese",
    "dashboard.modal.title": "Enter team information",
    "dashboard.modal.teamHeading": "Team {teamNumber}",
    "dashboard.modal.teamNameLabel": "Team name",
    "dashboard.modal.sessionIdLabel": "Session ID",
    "dashboard.modal.teamNamePlaceholder1": "e.g., Sushi",
    "dashboard.modal.teamNamePlaceholder2": "e.g., Tempura",
    "dashboard.modal.sessionPlaceholder1": "e.g., session1",
    "dashboard.modal.sessionPlaceholder2": "e.g., session2",
    "dashboard.modal.submit": "Save",
    "dashboard.section.teamTitle": "Team {teamName}",
    "energy.geothermal": "Geothermal",
    "energy.hydrogen": "Human power",
    "energy.wind": "Wind power",
    "energy.solar": "Solar power",
    "energy.geothermalShort": "Geothermal",
    "energy.hydrogenShort": "Human power",
    "energy.windShort": "Wind",
    "energy.solarShort": "Solar",
    "energy.fireShort": "Thermal",
    "chart.buttons.start": "Start",
    "chart.buttons.stop": "Stop",
    "chart.buttons.clear": "Clear",
    "chart.buttons.fullView": "Show all",
    "chart.totalPower": "Total power {value}kWh",
    "chart.filterLabel": "Start time:",
    "chart.filterPlaceholder": "e.g., 14:30:00",
    "chart.loading": "Loading data...",
    "chart.errorTitle": "An error occurred",
    "chart.resultLoading": "Loading chart data...",
    "chart.resultErrorTitle": "Failed to load chart data",
    "chart.noData": "No chart data available",
    "chart.title": "Power output trends by module",
    "chart.axis.power": "Power (kW)",
    "chart.axis.time": "Time",
    "result.summary.energyMixTitle": "Energy mix",
    "result.summary.energyMixTotal": "Total",
    "result.summary.totalPowerLabel": "Total power (kWh)",
    "result.summary.maxInstantTitle": "Peak output",
    "result.pie.title": "Energy mix",
    "result.pie.totalLabel": "Total",
    "result.team.heading": "Team {teamName}",
    "result.team.totalPowerTitle": "Electricity everyone made",
    "result.team.totalPowerNote": "(Total kWh)",
    "result.team.maxInstantTitle": "Peak generation",
    "result.team.co2Title": "CO₂ reduction",
    "result.team.happinessTitle": "Town comfort",
    "result.team.happiness.environment": "Environment (CO₂ / noise)",
    "result.team.happiness.power": "Power stability (outages)",
    "result.team.happiness.infrastructure":
      "Infrastructure (homes / trains / shops)",
    "result.team.additionalVoices": "More voices",
    "result.team.scoreLabel": "Score:",
    "result.team.complaintCount": "{count} reports",
    "result.team.commentQuote": '"{comment}"',
    "result.page.loading": "Loading...",
    "result.page.error": "Error",
    "result.page.backButton": "Back to dashboard",
    "result.villagerTitle": "Feedback from villagers",
    "result.page.fetchError": "Failed to fetch data",
  },
} as const;

type TranslationKey = keyof typeof translations.ja;

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const replaceVariables = (
  template: string,
  variables?: TranslationVariables
): string => {
  if (!variables) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key];
    return value !== undefined ? String(value) : match;
  });
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ja");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("uiLanguage");
    if (stored === "ja" || stored === "en") {
      setLanguage(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("uiLanguage", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: TranslationKey, variables?: TranslationVariables) => {
      const dictionary = translations[language];
      const template = dictionary[key];
      if (!template) {
        console.warn(`Missing translation for key: ${key}`);
        return key;
      }
      return replaceVariables(template, variables);
    },
    [language]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "ja" ? "en" : "ja"));
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, t, toggleLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export type { TranslationKey };
