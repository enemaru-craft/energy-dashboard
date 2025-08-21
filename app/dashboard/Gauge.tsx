// app/dashboard/GaugeWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {});

export function GeothermalGauge({ value }: { value?: number }) {
  const [val, setVal] = useState(value ?? 0);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/energy");
      const data = await res.json();
      setVal(data.current);
    }
    fetchData();

    // 10秒ごとに更新
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <GaugeComponent
      value={50}
      type="radial"
      labels={{
        valueLabel: {
          formatTextValue: (value) => `${value}kW`,
          style: {
            fill: "#2EB682",
            fontSize: "30px",
            fontWeight: "bold",
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

export function SolarGauge({ value }: { value?: number }) {
  const [val, setVal] = useState(value ?? 0);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/energy");
      const data = await res.json();
      setVal(data.current);
    }
    fetchData();

    // 10秒ごとに更新
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  return <GaugeComponent value={val} />;
}

export function WindGauge({ value }: { value?: number }) {
  const [val, setVal] = useState(value ?? 0);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/energy");
      const data = await res.json();
      setVal(data.current);
    }
    fetchData();

    // 10秒ごとに更新
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  return <GaugeComponent value={val} />;
}

export function HydrogenGauge({ value }: { value?: number }) {
  const [val, setVal] = useState(value ?? 0);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/energy");
      const data = await res.json();
      setVal(data.current);
    }
    fetchData();

    // 10秒ごとに更新
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  return <GaugeComponent value={val} />;
}

export function HandCrankGauge({ value }: { value?: number }) {
  const [val, setVal] = useState(value ?? 0);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/energy");
      const data = await res.json();
      setVal(data.current);
    }
    fetchData();

    // 10秒ごとに更新
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  return <GaugeComponent value={val} />;
}
