// components/Map.tsx
"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export function PowerMap({ id }: { id: string }) {
  useEffect(() => {
    // 地図の初期化（東京駅あたり）
    const map = L.map(id).setView([35.10359, 137.14916], 18);

    // OSMタイルを読み込み
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // 座標にマーカーを追加
    L.marker([35.10359, 137.14916]).addTo(map).bindPopup("NITTC").openPopup();

    return () => {
      map.remove(); // アンマウント時に破棄
    };
  }, []);

  return <div id={id} style={{ height: "500px", width: "100%" }} />;
}
