import { Gauge } from "./Gauge";
import type { Metadata } from "next";
import { PowerLineChart } from "./PowerChart";
import { PowerMap } from "./Map";

export const metadata: Metadata = {
  title: "Energy Dashboard",
  description: "発電量確認用ダッシュボード",
};

export default function DashboardPage() {
  const labels = ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00"];
  const geothermal = [10, 12, 11, 13, 12, 14, 15];
  const hydro = [20, 22, 21, 23, 22, 24, 25];
  const wind = [5, 7, 6, 8, 7, 9, 10];
  const solar = [0, 0, 5, 10, 15, 20, 25];
  return (
    <div className="w-full  font-3xl min-h-screen p-8 ">
      <h1 className="text-3xl font-bold mb-6">Energy Dashboard</h1>
      <section className="flex w-full mb-6">
        <div className="flex-1 flex justify-center">
          <p className="border rounded-2xl bg-white text-5xl font-bold px-8 py-4">
            Team寿司
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <p className="border rounded-2xl bg-white text-5xl font-bold px-8 py-4">
            Team天ぷら
          </p>
        </div>
      </section>

      <div className="flex gap-6">
        <section className="w-1/2 flex border rounded-4xl bg-white shadow-2xl p-6">
          <div className="grid grid-cols-4 gap-10 w-full">
            <div className="flex flex-col items-center justify-center">
              <Gauge deviceType="geothermal" sessionId="10" />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Gauge deviceType="hydrogen" sessionId="10" />
              <span className="font-bold text-2xl">水力発電</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Gauge deviceType="wind" sessionId="10" />
              <span className="font-bold text-2xl">風力発電</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Gauge deviceType="solar" sessionId="10" />
              <span className="font-bold text-2xl">太陽光発電</span>
            </div>
          </div>
        </section>
        <section className="w-1/2 flex border rounded-4xl bg-white shadow-2xl p-6">
          <div className="grid grid-cols-4 gap-10 w-full">
            <div className="flex flex-col items-center justify-center">
              <Gauge deviceType="geothermal" sessionId="10" />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Gauge deviceType="hydrogen" sessionId="10" />
              <span className="font-bold text-2xl">水力発電</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Gauge deviceType="wind" sessionId="10" />
              <span className="font-bold text-2xl">風力発電</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Gauge deviceType="solar" sessionId="10" />
              <span className="font-bold text-2xl">太陽光発電</span>
            </div>
          </div>
        </section>
      </div>

      <div className="flex gap-6 mb-6 mt-6">
        <section className="flex-1 border rounded-4xl bg-white shadow-2xl p-6 mb-6">
          <PowerLineChart
            timeLabels={labels}
            geothermal={geothermal}
            hydro={hydro}
            wind={wind}
            solar={solar}
          />
        </section>
        <section className="flex-1 border rounded-4xl bg-white shadow-2xl p-6 mb-6">
          <PowerLineChart
            timeLabels={labels}
            geothermal={geothermal}
            hydro={hydro}
            wind={wind}
            solar={solar}
          />
        </section>
      </div>

      <div className="flex  gap-6 mb-6 mt-6">
        <section className="border rounded-4xl bg-white shadow-2xl p-6 mb-6 flex-1">
          <PowerMap id="map1" />
        </section>
        <section className="border rounded-4xl bg-white shadow-2xl p-6 mb-6 flex-1">
          <PowerMap id="map2" />
        </section>
      </div>
    </div>
  );
}
