import React, { useEffect, useState } from "react";

const PROFILES = {
  normal: { label: "Normal", soilMoistureMin: 25, soilMoistureCritical: 18, tempMax: 36, rainReset: 2, irrigationMinutes: 10, irrigationVolumeMm: 10, irrigationCooldownMinutes: 30, consecutiveSamplesForAlert: 3 },
  dry:   { label: "Dry season", soilMoistureMin: 30, soilMoistureCritical: 22, tempMax: 38, rainReset: 1.5, irrigationMinutes: 12, irrigationVolumeMm: 14, irrigationCooldownMinutes: 20, consecutiveSamplesForAlert: 2 },
  wet:   { label: "Wet season", soilMoistureMin: 20, soilMoistureCritical: 14, tempMax: 35, rainReset: 4, irrigationMinutes: 6, irrigationVolumeMm: 6, irrigationCooldownMinutes: 60, consecutiveSamplesForAlert: 4 },
};

export default function ThresholdsPanel({ thresholds = {}, onSave }) {
  const [local, setLocal] = useState({ ...thresholds, autoIrrigate: false, profile: "normal" });

  useEffect(() => setLocal({ ...thresholds, autoIrrigate: thresholds.autoIrrigate || false, profile: thresholds.profile || "normal" }), [thresholds]);

  const handle = (k, v) => setLocal((p) => ({ ...p, [k]: typeof v === "number" ? v : (isNaN(Number(v)) ? v : Number(v)) }));

  const applyProfile = (key) => {
    const p = PROFILES[key];
    if (!p) return;
    setLocal((cur) => ({ ...cur, ...p, profile: key }));
  };

  const save = () => {
    if (onSave) onSave(local);
    // optional toast
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Thresholds & Automation</h3>
        <div className="text-sm text-slate-500">Customize alerts and auto-irrigation</div>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500">Profile</label>
          <div className="flex gap-2 mt-1">
            <select value={local.profile} onChange={(e) => applyProfile(e.target.value)} className="p-2 border rounded">
              {Object.entries(PROFILES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <button onClick={() => applyProfile(local.profile)} className="px-3 py-2 bg-indigo-600 text-white rounded">Apply</button>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500">Auto-irrigate</label>
          <div className="mt-1">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={local.autoIrrigate || false} onChange={(e) => handle("autoIrrigate", e.target.checked)} />
              <span className="text-sm">Enable automatic irrigation (requires actuator)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500">Soil moisture min (%)</label>
          <input value={local.soilMoistureMin ?? ""} onChange={(e) => handle("soilMoistureMin", e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="text-xs text-slate-500">Soil moisture critical (%)</label>
          <input value={local.soilMoistureCritical ?? ""} onChange={(e) => handle("soilMoistureCritical", e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="text-xs text-slate-500">Max air temp (°C)</label>
          <input value={local.tempMax ?? ""} onChange={(e) => handle("tempMax", e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="text-xs text-slate-500">Rain reset (mm)</label>
          <input value={local.rainReset ?? ""} onChange={(e) => handle("rainReset", e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="text-xs text-slate-500">Irrigation time (minutes)</label>
          <input value={local.irrigationMinutes ?? 10} onChange={(e) => handle("irrigationMinutes", e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="text-xs text-slate-500">Irrigation volume (mm)</label>
          <input value={local.irrigationVolumeMm ?? 10} onChange={(e) => handle("irrigationVolumeMm", e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="text-xs text-slate-500">Cooldown (minutes)</label>
          <input value={local.irrigationCooldownMinutes ?? 30} onChange={(e) => handle("irrigationCooldownMinutes", e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="text-xs text-slate-500">Consecutive samples for alert</label>
          <input value={local.consecutiveSamplesForAlert ?? 3} onChange={(e) => handle("consecutiveSamplesForAlert", e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        <button onClick={() => setLocal(thresholds)} className="px-4 py-2 bg-white border rounded">Reset</button>
      </div>
    </div>
  );
}
