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

    // マップ初期化
    const map = L.map(mapId).setView([35.10324, 137.14731], 20);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // デバイス種別ごとの色設定
    const colors: Record<string, string> = {
      hydrogen: "blue",
      geothermal: "red",
      wind: "green",
      solar: "yellow",
    };

    const deviceTypes = Object.keys(colors); // ["hydrogen", "geothermal", "wind", "solar"]

    // deviceIdごとにマーカーを管理
    const markers = new Map<string, L.CircleMarker>();

    async function updateMarkers() {
      let grandTotalPower = 0;
      const currentDeviceIds = new Set<string>();

      for (const deviceType of deviceTypes) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/get-latest-multiple-device-power?device_type=${deviceType}&session_id=${sessionId}`
          );

          if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
          }

          const data: ApiResponse = await res.json();
          grandTotalPower += data.totalPower;

          data.devices.forEach((device) => {
            const lat = parseFloat(device.gpsLat);
            const lon = parseFloat(device.gpsLon);

            if (!isNaN(lat) && !isNaN(lon)) {
              currentDeviceIds.add(device.deviceId);

              const existingMarker = markers.get(device.deviceId);
              const color = colors[device.deviceType] || "gray";

              if (existingMarker) {
                // 位置が変わっていれば更新
                existingMarker.setLatLng([lat, lon]);

                // 表示内容を更新（パワーが変わった場合など）
                existingMarker.bindPopup(
                  `
                    <div>
                      <strong>${device.deviceType}</strong><br/>
                      ID: ${device.deviceId}<br/>
                      Power: ${device.power} kW
                    </div>
                  `
                );
              } else {
                // 新しいマーカーを追加
                const newMarker = L.circleMarker([lat, lon], {
                  radius: 7,
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.8,
                }).bindPopup(
                  `
                    <div>
                      <strong>${device.deviceType}</strong><br/>
                      ID: ${device.deviceId}<br/>
                      Power: ${device.power} kW
                    </div>
                  `
                );

                newMarker.addTo(map);
                markers.set(device.deviceId, newMarker);
              }
            }
          });
        } catch (err) {
          console.error(`Failed to fetch ${deviceType}:`, err);
        }
      }

      // APIに含まれなかった古いマーカーを削除
      markers.forEach((marker, deviceId) => {
        if (!currentDeviceIds.has(deviceId)) {
          marker.remove();
          markers.delete(deviceId);
        }
      });
    }

    // 初回実行
    updateMarkers();

    // 3秒ごとに更新
    const interval = setInterval(updateMarkers, 3000);

    // クリーンアップ
    return () => clearInterval(interval);
  }, [mapId, sessionId]);

  return <div id={mapId} style={{ height: "500px", width: "100%" }} />;
}
