import { GeothermalGauge } from "./Gauge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Energy Dashboard",
  description: "発電量確認用ダッシュボード",
};

export default function DashboardPage() {
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
        <section className="justify-center w-1/2 flex  border rounded-4xl bg-white shadow-2xl ">
          <div className="grid grid-cols-2 gap-6 auto-rows-fr  pb-6">
            <div className="w-full h-full flex  flex-col items-center justify-center ">
              <GeothermalGauge value={0} />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
            <div className="w-full h-full flex  flex-col items-center justify-center ">
              <GeothermalGauge value={0} />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
            <div className="w-full h-full flex  flex-col items-center justify-center ">
              <GeothermalGauge value={0} />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
            <div className="w-full h-full flex  flex-col items-center justify-center ">
              <GeothermalGauge value={0} />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
          </div>
        </section>
        <section className="justify-center w-1/2 flex  border rounded-4xl bg-white shadow-2xl ">
          <div className="grid grid-cols-2 gap-6 auto-rows-fr  pb-6">
            <div className="w-full h-full flex  flex-col items-center justify-center ">
              <GeothermalGauge value={0} />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
            <div className="w-full h-full flex  flex-col items-center justify-center ">
              <GeothermalGauge value={0} />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
            <div className="w-full h-full flex  flex-col items-center justify-center ">
              <GeothermalGauge value={0} />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
            <div className="w-full h-full flex  flex-col items-center justify-center ">
              <GeothermalGauge value={0} />
              <span className="font-bold text-2xl">地熱発電</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
