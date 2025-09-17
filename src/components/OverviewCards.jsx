import React from "react";

function Card({ title, value, hint, accent = "from-sky-400 to-sky-600" }) {
  return (
    <div className={`p-4 rounded-2xl text-white shadow bg-gradient-to-r ${accent}`}>
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {hint && <div className="text-xs text-white/80 mt-1">{hint}</div>}
    </div>
  );
}

export default function OverviewCards({ latest = {}, thresholds = {} }) {
  const env = latest?.environment ?? {};
  const soil = latest?.soil ?? {};
  const weather = latest?.weather ?? {};
  const light = latest?.light ?? {};
  return (
    <div className="grid grid-cols-1 gap-3">
      <Card title="Air Temp" value={env.temp? `${env.temp.toFixed(1)} °C` : "—"} hint="Ambient" accent="from-red-400 to-orange-500" />
      <Card title="Humidity" value={env.humidity? `${env.humidity.toFixed(1)} %` : "—"} hint="Relative" accent="from-blue-400 to-indigo-600" />
      <Card title="Soil Moisture" value={soil.moisture? `${soil.moisture.toFixed(1)} %` : "—"} hint="Topsoil" accent="from-green-400 to-green-600" />
      <Card title="Rain (recent)" value={weather.rain? `${weather.rain.toFixed(2)} mm` : "—"} hint="Precipitation" accent="from-sky-400 to-sky-600" />
      <Card title="Light" value={light.lux? `${Number(light.lux).toLocaleString()} lx` : "—"} hint="Illuminance" accent="from-yellow-300 to-yellow-600" />
    </div>
  );
}
