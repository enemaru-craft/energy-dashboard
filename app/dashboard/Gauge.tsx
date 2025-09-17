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
  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_BASE_URL);
    async function fetchData() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/get-latest-power?device_type=${deviceType}&session_id=${sessionId}`
      );
      const data = await res.json();
      setValue(data.latestPower);
    }
    fetchData();

    // 10秒ごとに更新
    const timer = setInterval(fetchData, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <GaugeComponent
      value={value}
      type="radial"
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
          ticks: [
            { value: 20 },
            { value: 40 },
            { value: 60 },
            { value: 80 },
            { value: 100 },
          ],
        },
      }}
      arc={{
        gradient: true,
        // 3色で指定 → 最初と最後の2色は緑グラデーション、最後は赤で固定
        colorArray: ["#C2EE70", "#3CDF9C", "#0CF3B2", "#3ED6A4"],
        subArcs: [
          { limit: 30 }, // 0〜30% は 緑グラデーション
          { limit: 60 }, // 0〜30% は 緑グラデーション
          { limit: 90 }, // 30〜90% は 緑グラデーション
          { limit: 100 }, // 90〜100% は 赤
        ],
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
