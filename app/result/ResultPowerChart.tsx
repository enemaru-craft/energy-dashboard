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

import { useLanguage } from "../../components/LanguageProvider";
import { shiftTimeLabelByHours } from "../../lib/time";

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
  const { t } = useLanguage();
  const [data, setData] = useState<PowerChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPower, setTotalPower] = useState<number>(0);
  const [filterTime, setFilterTime] = useState(""); // holds HH:mm for time filter
  const filterLabel = t("chart.filterLabel");
  const filterPlaceholder = t("chart.filterPlaceholder");

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

        // handle empty or invalid payloads from the API
        if (!json || !json.timeLabels || json.timeLabels.length === 0) {
          // configure empty chart structure
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

        // update totalPower state once we have valid data
        if (json.totalPower !== undefined) {
          setTotalPower(json.totalPower);
        }

        // result screen renders the full dataset
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

    // fetch data once on mount
    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">{t("chart.resultLoading")}</p>
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
            {t("chart.resultErrorTitle")}
          </p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // render an empty chart shell when data is missing
  if (!data || !data.timeLabels || data.timeLabels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t("chart.noData")}</p>
      </div>
    );
  }

  // convert an HH:mm:ss string into seconds
  const timeToSeconds = (timeStr: string): number => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + (seconds || 0);
  };

  // helper to check if a timestamp matches the filter
  const filterDataByTime = (dataset: PowerChartData) => {
    const trimmedFilter = filterTime.trim();
    const hasFilter = trimmedFilter !== "";
    const filterSeconds = hasFilter ? timeToSeconds(trimmedFilter) : null;

    const result = {
      timeLabels: [] as string[],
      geothermal: [] as number[],
      hydro: [] as number[],
      wind: [] as number[],
      solar: [] as number[],
    };

    dataset.timeLabels.forEach((label, index) => {
      const shiftedLabel = shiftTimeLabelByHours(label, 9);
      const labelSeconds = timeToSeconds(shiftedLabel);
      if (
        !hasFilter ||
        (filterSeconds !== null && labelSeconds >= filterSeconds)
      ) {
        result.timeLabels.push(shiftedLabel);
        result.geothermal.push(dataset.geothermal[index]);
        result.hydro.push(dataset.hydro[index]);
        result.wind.push(dataset.wind[index]);
        result.solar.push(dataset.solar[index]);
      }
    });

    return result;
  };

  // derive filtered dataset based on the selected time
  const filteredData = filterDataByTime(data);

  const chartData = {
    labels: filteredData.timeLabels,
    datasets: [
      {
        label: t("energy.geothermalShort"),
        data: filteredData.geothermal,
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.4)",
        fill: true,
      },
      {
        label: t("energy.solarShort"),
        data: filteredData.solar,
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251,191,36,0.4)",
        fill: "-1",
      },
      {
        label: t("energy.windShort"),
        data: filteredData.wind,
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.4)",
        fill: "-1",
      },
      {
        label: t("energy.hydrogenShort"),
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
        text: t("chart.title"),
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
          text: t("chart.axis.power"),
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
          text: t("chart.axis.time"),
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
      {/* total energy label and time filter controls */}
      <div className="flex items-center justify-center gap-6 mb-4">
        {/* total energy output */}
        <div className="px-4 py-2 rounded font-semibold bg-blue-100 border border-blue-300 text-blue-800">
          {t("chart.totalPower", { value: totalPower.toFixed(2) })}
        </div>

        {/* time filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            {filterLabel}
          </label>
          <input
            type="time"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="1"
            placeholder={filterPlaceholder}
          />
        </div>
      </div>

      {/* chart canvas */}
      <Line data={chartData} options={options} />
    </div>
  );
};
