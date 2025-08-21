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
      type="radial"
      arc={{
        colorArray: ["#5BE12C", "#EA4228"],
        subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
        padding: 0.02,
        width: 0.3,
      }}
      value={80}
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
