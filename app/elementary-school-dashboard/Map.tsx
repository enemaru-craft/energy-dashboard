"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Device = {
  deviceId: string;
  deviceType: string;
  power: number;
  gpsLat: string;
  gpsLon: string;
};

type ApiResponse = {
  totalPower: number;
  devices: Device[];
};

export function PowerMap({
  mapId,
  sessionId,
}: {
  mapId: string;
  sessionId: string;
}) {
  useEffect(() => {
    // 既存マップがあれば破棄
    const container = L.DomUtil.get(mapId);
    if (container != null) {
      (container as any)._leaflet_id = null;
    }

    const map = L.map(mapId).setView([35.10324, 137.14731], 20);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // デバイスごとの色分け設定
    const colors: Record<string, string> = {
      hydrogen: "blue",
      geothermal: "red",
      wind: "green",
      solar: "yellow",
    };

    const deviceTypes = Object.keys(colors); // ["hydrogen", "geothermal", "wind", "solar"]

    async function addMarkers() {
      let grandTotalPower = 0;

      for (const deviceType of deviceTypes) {
        try {
          // 各デバイス種別ごとにAPIを叩く
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/get-latest-multiple-device-power?device_type=${deviceType}&session_id=${sessionId}`
          );

          if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
          }

          const data: ApiResponse = await res.json();

          // 合計発電量を累積
          grandTotalPower += data.totalPower;

          // 各デバイスをマップに追加
          data.devices.forEach((device) => {
            const lat = parseFloat(device.gpsLat);
            const lon = parseFloat(device.gpsLon);

            if (!isNaN(lat) && !isNaN(lon)) {
              const color = colors[device.deviceType] || "gray";

              L.circleMarker([lat, lon], {
                radius: 7,
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
              })
                .addTo(map)
                .bindPopup(
                  `
                  <div>
                    <strong>${device.deviceType}</strong><br/>
                    ID: ${device.deviceId}<br/>
                    Power: ${device.power} kW
                  </div>
                `
                );
            }
          });
        } catch (err) {
          console.error(`Failed to fetch ${deviceType}:`, err);
        }
      }

      // 全デバイス合計を確認用にログ出力
      console.log("Grand Total Power:", grandTotalPower);
    }

    addMarkers();
  }, [mapId, sessionId]);

  return <div id={mapId} style={{ height: "500px", width: "100%" }} />;
}
