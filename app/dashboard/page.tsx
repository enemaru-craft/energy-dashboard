import { GeothermalGauge } from "./Gauge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Energy Dashboard",
  description: "発電量確認用ダッシュボード",
};

export default function DashboardPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Energy Dashboard</h1>
      <div className="flex gap-6">
        <section>
          <div className="grid grid-cols-2 gap-6 auto-rows-fr">
            <div className="w-full h-full flex items-center justify-center">
              <GeothermalGauge value={0} />
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <GeothermalGauge value={0} />
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <GeothermalGauge value={0} />
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <GeothermalGauge value={0} />
            </div>
          </div>
        </section>
        <section>
          <div className="grid grid-cols-2 gap-6 auto-rows-fr">
            <div className="w-full h-full flex items-center justify-center">
              <GeothermalGauge value={0} />
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <GeothermalGauge value={0} />
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <GeothermalGauge value={0} />
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <GeothermalGauge value={0} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
