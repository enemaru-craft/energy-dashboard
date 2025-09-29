// app/dashboard/GaugeWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {});

export function Gauge({
  deviceType,
  sessionId,
}: {
  deviceType: string;
  sessionId: string;
}) {
  const [value, setValue] = useState(0);

  // 発電タイプに応じたゲージ設定を取得
  const getGaugeConfig = (deviceType: string) => {
    switch (deviceType) {
      case "geothermal": // 地熱 100～200kW
        return {
          minValue: 100,
          maxValue: 200,
          ticks: [
            { value: 120 },
            { value: 140 },
            { value: 160 },
            { value: 180 },
            { value: 200 },
          ],
          subArcs: [
            { limit: 120 },
            { limit: 140 },
            { limit: 160 },
            { limit: 180 },
            { limit: 200 },
          ],
        };
      case "wind": // 風力 100-420kW
        return {
          minValue: 100,
          maxValue: 420,
          ticks: [
            { value: 164 },
            { value: 228 },
            { value: 292 },
            { value: 356 },
            { value: 420 },
          ],
          subArcs: [
            { limit: 164 },
            { limit: 228 },
            { limit: 292 },
            { limit: 356 },
            { limit: 420 },
          ],
        };
      case "solar": // 太陽光 300-500kW
        return {
          minValue: 300,
          maxValue: 500,
          ticks: [
            { value: 340 },
            { value: 380 },
            { value: 420 },
            { value: 460 },
            { value: 500 },
          ],
          subArcs: [
            { value: 340 },
            { limit: 380 },
            { limit: 420 },
            { limit: 460 },
            { limit: 500 },
          ],
        };
      case "hydro": // 手押し（ボタン発電） 0-100kW
        return {
          minValue: 0,
          maxValue: 100,
          ticks: [
            { value: 20 },
            { value: 40 },
            { value: 60 },
            { value: 80 },
            { value: 100 },
          ],
          subArcs: [
            { limit: 20 },
            { limit: 40 },
            { limit: 60 },
            { limit: 80 },
            { limit: 100 },
          ],
        };
      default:
        return {
          minValue: 0,
          maxValue: 100,
          ticks: [
            { value: 20 },
            { value: 40 },
            { value: 60 },
            { value: 80 },
            { value: 100 },
          ],
          subArcs: [
            { value: 20 },
            { value: 40 },
            { value: 60 },
            { value: 80 },
            { value: 100 },
          ],
        };
    }
  };

  const gaugeConfig = getGaugeConfig(deviceType);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/get-latest-multiple-device-power?device_type=${deviceType}&session_id=${sessionId}`;

        const res = await fetch(url);

        if (!res.ok) {
          console.error(
            `[${deviceType}] API error:`,
            res.status,
            res.statusText
          );
          return;
        }

        const data = await res.json();

        if (data && typeof data.totalPower === "number") {
          setValue(data.totalPower);
        } else {
          console.warn(`[${deviceType}] Invalid totalPower in response:`, data);
        }
      } catch (error) {
        console.error(`[${deviceType}] Fetch error:`, error);
      }
    }
    fetchData();

    // 3秒ごとに更新
    const timer = setInterval(fetchData, 3000);
    return () => clearInterval(timer);
  }, [deviceType, sessionId]);

  return (
    <GaugeComponent
      value={value}
      type="radial"
      minValue={gaugeConfig.minValue}
      maxValue={gaugeConfig.maxValue}
      labels={{
        valueLabel: {
          formatTextValue: (value) => `${value}kW`,
          style: {
            fill: "#000000",
            fontSize: "30px",
            stroke: "none",
            paintOrder: "normal",
          },
        },
        tickLabels: {
          type: "inner",
          ticks: gaugeConfig.ticks,
        },
      }}
      arc={{
        gradient: true,
        // 3色で指定 → 最初と最後の2色は緑グラデーション、最後は赤で固定
        colorArray: ["#C2EE70", "#3CDF9C", "#0CF3B2", "#3ED6A4"],
        subArcs: gaugeConfig.subArcs,
        padding: 0,
        width: 0.2,
      }}
      pointer={{
        color: "#2EB682",
        length: 0.7,
        width: 18,
        elastic: true,
        animationDelay: 0,
      }}
    />
  );
}
