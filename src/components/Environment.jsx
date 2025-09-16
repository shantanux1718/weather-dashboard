import React from "react";
import { motion } from "framer-motion";

export default function Environment({ data = {}, accent = "#0ea5e9" }) {
  return (
    <motion.section className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 className="title">Environment</h3>

      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Ambient Temp</div>
            <div className="text-xl font-semibold">{(data.temp ?? 0).toFixed(2)} °C</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Humidity</div>
            <div className="text-xl font-semibold">{(data.humidity ?? 0).toFixed(1)}%</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Pressure</div>
            <div className="text-lg font-medium">{(data.pressure ?? 0).toFixed(1)} hPa</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Air (gas)</div>
            <div className="text-lg font-medium">{data.gas ?? "—"}</div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-sm text-slate-600">
          <div className="font-medium">SHT sensors</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-slate-500">SHT1</div>
              <div>{(data.sht1?.temp ?? 0).toFixed(2)} °C • {(data.sht1?.humidity ?? 0).toFixed(1)} %</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">SHT2</div>
              <div>{(data.sht2?.temp ?? 0).toFixed(2)} °C • {(data.sht2?.humidity ?? 0).toFixed(1)} %</div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
