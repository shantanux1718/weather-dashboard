import React from "react";
import { motion } from "framer-motion";

export default function WeatherOverview({ data = {}, accent = "#0ea5e9" }) {
  const rainPct = Math.min(100, (data.rain / 50) * 100 || 0);
  const windDirection = data.windDirection || "N";

  return (
    <motion.section className="card" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="title">Weather Overview</h3>
          <div className="text-sm text-slate-500">Live values</div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">Raw ADC</div>
          <div className="font-medium">{data.rawADC ?? "—"}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Rain</div>
            <div className="text-2xl font-bold">{(data.rain ?? 0).toFixed(2)} mm</div>
          </div>
          <div className="w-32">
            <div className="w-full bg-slate-100 rounded h-2 mt-2 overflow-hidden">
              <div style={{ width: `${rainPct}%`, background: accent }} className="h-2 rounded transition-all" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Wind</div>
            <div className="text-xl font-semibold">{(data.windSpeed ?? 0).toFixed(1)} km/h</div>
            <div className="text-xs text-slate-400">{windDirection} • {Math.round(data.windAngle ?? 0)}°</div>
          </div>

          <div className="flex items-center gap-3">
            <Compass angle={data.windAngle ?? 0} accent={accent} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Compass({ angle = 0, accent = "#0ea5e9" }) {
  return (
    <div className="w-14 h-14 flex items-center justify-center">
      <div className="relative w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 transition-transform" style={{ transform: `rotate(${angle}deg)` }}>
          <path d="M12 2 L15 12 L12 9 L9 12 Z" fill={accent} />
        </svg>
      </div>
    </div>
  );
}
