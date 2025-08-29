// components/PowerMap.tsx
"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export function PowerMap({
  mapId,
  sessionId,
}: {
  mapId: string;
  sessionId: string;
}) {
  useEffect(() => {
    // マップを初期化（既に存在している場合は破棄してから再作成）
    const container = L.DomUtil.get(mapId);
    if (container != null) {
      (container as any)._leaflet_id = null;
    }

    const map = L.map(mapId).setView([35.10324, 137.14731], 20);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // デバイスごとの色
    const colors: Record<string, string> = {
      hydrogen: "blue",
      geothermal: "red",
      wind: "green",
      solar: "yellow",
    };

    const deviceTypes = Object.keys(colors);

    async function addMarkers() {
      for (const deviceType of deviceTypes) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/get-latest-power?device_type=${deviceType}&session_id=${sessionId}`
          );
          const data = await res.json();

          const lat = parseFloat(data.gpsLat);
          const lon = parseFloat(data.gpsLon);
          const power = data.latestPower;

          if (!isNaN(lat) && !isNaN(lon)) {
            L.circleMarker([lat, lon], {
              radius: 7, // 円の大きさ
              color: colors[deviceType], // 枠線の色
              fillColor: colors[deviceType], // 中の色
              fillOpacity: 0.8,
            })
              .addTo(map)
              .bindPopup(`${deviceType}: ${power} kW`);
          }
        } catch (err) {
          console.error(`Failed to fetch ${deviceType}`, err);
        }
      }
    }

    addMarkers();
  }, [mapId, sessionId]);

  return <div id={mapId} style={{ height: "500px", width: "100%" }} />;
}
