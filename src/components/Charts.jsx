import React from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function Charts({ history = [], accent = "#0ea5e9" }) {
  const data = history.map((r) => ({
    ...r,
    airTemp: Number.isFinite(r.airTemp) ? r.airTemp : null,
    soilTemp: Number.isFinite(r.soilTemp) ? r.soilTemp : null,
    humidity: Number.isFinite(r.humidity) ? r.humidity : null,
    soilMoist: Number.isFinite(r.soilMoist) ? r.soilMoist : null,
    rain: Number.isFinite(r.rain) ? r.rain : null,
    light: Number.isFinite(r.light) ? r.light : null,
  }));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="title">Trends (last {data.length} samples)</h3>
        <div className="text-sm text-slate-500">Live</div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-slate-500 mb-1">Temperature (°C)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="airTemp" stroke={accent} name="Air Temp" dot={false} />
              <Line type="monotone" dataKey="soilTemp" stroke="#22c55e" name="Soil Temp" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm text-slate-500 mb-1">Humidity & Soil Moisture (%)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Air Humidity" dot={false} />
              <Line type="monotone" dataKey="soilMoist" stroke="#16a34a" name="Soil Moisture" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-500 mb-1">Rainfall (mm)</div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={data}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rain" stroke="#0ea5e9" name="Rainfall" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className="text-sm text-slate-500 mb-1">Light (lux)</div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={data}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="light" stroke="#f59e0b" name="Light" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
