import React from "react";

export default function Settings() {
  const profiles = {
    normal: { soilMoistureMin: 25, tempMax: 36, rainReset: 2 },
    dry: { soilMoistureMin: 30, tempMax: 38, rainReset: 1.5 },
    wet: { soilMoistureMin: 20, tempMax: 35, rainReset: 4 },
  };

  const applyProfile = (id) => {
    alert(`Open a farm and save this profile manually (copy values): ${id}`);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h3 className="text-lg font-semibold">Profiles</h3>
      <div className="mt-3 grid sm:grid-cols-3 gap-3">
        {Object.entries(profiles).map(([k,v]) => (
          <div key={k} className="p-3 rounded-lg border">
            <div className="font-medium">{k}</div>
            <div className="text-xs text-slate-500 mt-1">Soil min {v.soilMoistureMin}% • Max temp {v.tempMax}°C</div>
            <div className="mt-3">
              <button onClick={() => applyProfile(k)} className="px-3 py-1 bg-indigo-600 text-white rounded">Use</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
