"use client";
import dynamic from "next/dynamic";

export default function Home() {
  const GaugueComponent = dynamic(() => import("react-gauge-component"), {
    ssr: false,
  });
  return (
    <div>
      <GaugueComponent />
    </div>
  );
}
