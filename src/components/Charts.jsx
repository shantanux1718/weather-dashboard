import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function Charts({ history = [] }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Trends</h3>
        <div className="text-sm text-slate-500">Live</div>
      </div>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={history}>
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="6 6" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="airTemp" name="Air Temp" stroke="#ef4444" dot={false} />
            <Line type="monotone" dataKey="soilTemp" name="Soil Temp" stroke="#10b981" dot={false} />
            <Line type="monotone" dataKey="soilMoist" name="Soil Moisture" stroke="#06b6d4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
