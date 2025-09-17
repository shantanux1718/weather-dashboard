import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Map action types to clear farmer-oriented instructions.
 * Each object contains:
 *  - title: short instruction
 *  - steps: array of step-by-step actions (plain language)
 *  - severity: 'info'|'warning'|'critical'
 */
const ACTION_MAP = {
  irrigate: {
    title: "Irrigation recommended",
    severity: "critical",
    steps: [
      "Check the water pump and main valves.",
      "If pump works, start irrigation for the recommended duration (see Thresholds panel).",
      "After irrigation, wait for the cooldown time before re-irrigating.",
      "If pump fails, call technician or use manual watering."
    ],
  },
  "skip-irrigation": {
    title: "Skip irrigation — recent rain",
    severity: "info",
    steps: [
      "Recent rain detected. Do not irrigate to avoid waterlogging.",
      "Check drainage if soil stays saturated for >24h."
    ],
  },
  "in-cooldown": {
    title: "Irrigation cooldown active",
    severity: "info",
    steps: [
      "Irrigation was done recently; system is waiting for the cooldown period.",
      "You can view cooldown time next to the Irrigate button."
    ],
  },
  "reduce-heat-stress": {
    title: "High temperature — reduce heat stress",
    severity: "warning",
    steps: [
      "Consider temporary shading or overhead watering in early morning/evening.",
      "Ensure soil moisture is adequate — irrigate only if not in cooldown.",
      "Monitor plants for wilting; seek agronomy advice if prolonged heat."
    ],
  },
  "ec-warning": {
    title: "Soil salinity / EC high",
    severity: "warning",
    steps: [
      "High soil conductivity detected — this can reduce crop uptake.",
      "Test soil sample in lab if possible.",
      "Consider leaching with good-quality water or corrective soil treatment.",
      "Avoid further fertilization until resolved."
    ],
  },
  "monitor-temp": {
    title: "Temperature approaching high",
    severity: "info",
    steps: [
      "Temperatures are reaching a warning level.",
      "Reduce stressful tasks during hottest hours and ensure irrigation schedule is healthy."
    ],
  },
};

function SeverityBadge({ level }) {
  if (level === "critical") return <span className="text-red-700 font-semibold">CRITICAL</span>;
  if (level === "warning") return <span className="text-amber-700 font-semibold">WARNING</span>;
  return <span className="text-green-700 font-semibold">INFO</span>;
}

export default function AlertsPanel({ analysis = { actions: [], summary: "" } }) {
  const actions = analysis.actions || [];

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recommendations</h3>
        <div className="text-sm text-slate-500">Plain language steps for farmers</div>
      </div>

      <div className="mt-3 space-y-3">
        <AnimatePresence>
          {actions.length === 0 && (
            <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="font-medium text-emerald-700">✅ All good — no immediate actions</div>
                <div className="text-sm text-slate-600 mt-1">Keep monitoring. Follow scheduled maintenance and inspect irrigation weekly.</div>
              </div>
            </motion.div>
          )}

          {actions.map((a, i) => {
            const meta = ACTION_MAP[a.type] || { title: a.type, steps: [a.reason || "Follow best practice."], severity: a.severity || "info" };
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-slate-800">{meta.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{a.reason}</div>
                    </div>
                    <div className="text-right">
                      <SeverityBadge level={meta.severity} />
                    </div>
                  </div>

                  <ol className="mt-2 ml-4 text-sm text-slate-700 list-decimal space-y-1">
                    {meta.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ol>

                  {/* Small friendly footer */}
                  <div className="mt-3 text-xs text-slate-500">Tip: if unsure, contact agronomist or check help in Settings.</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
