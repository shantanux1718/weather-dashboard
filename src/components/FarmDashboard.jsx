/* Full FarmDashboard.jsx - includes SSE connection, cards, charts, alerts, thresholds */
import React, { useEffect, useState, useRef } from "react";
import OverviewCards from "./OverviewCards.jsx";
import Charts from "./Charts.jsx";
import ThresholdsPanel from "./ThresholdsPanel.jsx";
import AlertsPanel from "./AlertsPanel.jsx";
import { motion } from "framer-motion";
import { API_STREAM } from "../lib/config";

const DEFAULT_THRESHOLDS = {
  soilMoistureMin: 25,
  soilMoistureCritical: 18,
  tempMax: 36,
  tempWarning: 34,
  rainReset: 2,
  irrigationCooldownMinutes: 30,
  consecutiveSamplesForAlert: 3,
};

function nowMs() { return Date.now(); }
function formatTimeAgo(ts) {
  if (!ts) return "never";
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d/60)}m ago`;
  return `${Math.floor(d/3600)}h ago`;
}
function formatCountdown(msLeft) {
  if (msLeft <= 0) return "ready";
  const s = Math.ceil(msLeft/1000);
  if (s < 60) return `${s}s`;
  const m = Math.ceil(s/60);
  if (m < 60) return `${m}m`;
  return `${Math.ceil(m/60)}h`;
}

export default function FarmDashboard({ farm, apiBase }) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [thresholds, setThresholds] = useState(() => {
    try {
      const raw = localStorage.getItem(`thresholds:${farm.id}`);
      return raw ? JSON.parse(raw) : DEFAULT_THRESHOLDS;
    } catch (e) {
      return DEFAULT_THRESHOLDS;
    }
  });

  const stateRef = useRef({
    soilLowCount: 0,
    lastIrrigationAt: Number(localStorage.getItem(`lastIrrigationAt:${farm.id}`) || 0),
  });

  // SSE connection
  useEffect(() => {
    const streamUrl = (API_STREAM.includes("/stream") ? `${API_STREAM}?farm=${encodeURIComponent(farm.id)}` : `${apiBase}/stream?farm=${encodeURIComponent(farm.id)}`);
    const es = new EventSource(streamUrl);
    es.onmessage = (evt) => {
      try {
        const json = JSON.parse(evt.data);
        setLatest(json);
      } catch (e) {
        console.error("SSE parse", e);
      }
    };
    es.onerror = (err) => {
      console.error("SSE error", err);
    };
    return () => es.close();
  }, [farm.id, apiBase]);

  // keep history and run simple logic
  useEffect(() => {
    if (!latest) return;
    setHistory((h) => {
      const next = [...h.slice(-(120 - 1)), {
        time: new Date(latest.timestamp).toLocaleTimeString(),
        airTemp: latest.environment?.temp ?? null,
        soilTemp: latest.soil?.temp ?? null,
        humidity: latest.environment?.humidity ?? null,
        soilMoist: latest.soil?.moisture ?? null,
        rain: latest.weather?.rain ?? null,
        light: latest.light?.lux ?? null,
      }];
      return next;
    });
  }, [latest]);

  // evaluate alerts (simple, based on thresholds)
  const analyze = () => {
    if (!latest) return { actions: [], summary: "No data yet" };
    const a = [];
    const sMoist = latest.soil?.moisture ?? null;
    const temp = latest.environment?.temp ?? null;
    const rain = latest.weather?.rain ?? 0;

    // soil consecutive
    if (sMoist !== null && sMoist < thresholds.soilMoistureMin) {
      stateRef.current.soilLowCount = (stateRef.current.soilLowCount || 0) + 1;
    } else {
      stateRef.current.soilLowCount = 0;
    }
    const enough = (stateRef.current.soilLowCount || 0) >= (thresholds.consecutiveSamplesForAlert || 1);
    const lastIrr = stateRef.current.lastIrrigationAt || 0;
    const cooldownMs = (thresholds.irrigationCooldownMinutes || 30) * 60 * 1000;
    const inCooldown = (nowMs() - lastIrr) < cooldownMs;
    const recentlyRained = rain >= (thresholds.rainReset || 2);

    if (sMoist !== null) {
      if (enough && !recentlyRained && !inCooldown) {
        if (sMoist < thresholds.soilMoistureCritical) a.push({ type: "irrigate", severity: "critical", reason: `Soil ${sMoist}% < critical ${thresholds.soilMoistureCritical}%`});
        else a.push({ type: "irrigate", severity: "warning", reason: `Soil ${sMoist}% < min ${thresholds.soilMoistureMin}%`});
      } else if (enough && recentlyRained) {
        a.push({ type: "skip-irrigation", severity: "info", reason: `Recent rain ${rain}mm — skip irrigation`});
      } else if (inCooldown) {
        a.push({ type: "in-cooldown", severity: "info", reason: `Irrigated ${formatTimeAgo(lastIrr)} — cooldown active`});
      }
    }
    if (temp !== null) {
      if (temp > thresholds.tempMax) a.push({ type: "heat", severity: "warning", reason: `Air ${temp}°C > ${thresholds.tempMax}°C`});
      else if (temp > thresholds.tempWarning) a.push({ type: "monitor-temp", severity: "info", reason: `Air ${temp}°C > ${thresholds.tempWarning}°C`});
    }

    const summary = a.length ? `Recommended: ${a.map(x => x.type).join(", ")}` : "All conditions normal";
    return { actions: a, summary };
  };

  const analysis = analyze();

  const saveThresholds = (t) => {
    setThresholds(t);
    localStorage.setItem(`thresholds:${farm.id}`, JSON.stringify(t));
  };

  const handleIrrigate = async () => {
    if (!latest) return;
    const cur = latest.soil?.moisture ?? 20;
    const newMoist = Math.min(100, +(cur + 20).toFixed(1));
    try {
      const pushUrl = `${apiBase}/push?farm=${encodeURIComponent(farm.id)}`;
      const resp = await fetch(pushUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ soil: { moisture: newMoist } }) });
      if (resp.ok) {
        stateRef.current.lastIrrigationAt = Date.now();
        localStorage.setItem(`lastIrrigationAt:${farm.id}`, String(stateRef.current.lastIrrigationAt));
        stateRef.current.soilLowCount = 0;
      } else {
        console.error("Push failed", resp.statusText);
      }
    } catch (e) {
      console.error("Irrigate error", e);
    }
  };

  const cooldownLeftMs = (() => {
    const last = stateRef.current.lastIrrigationAt || 0;
    const cooldownMs = (thresholds.irrigationCooldownMinutes || 30) * 60 * 1000;
    const left = cooldownMs - (Date.now() - last);
    return left > 0 ? left : 0;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500">Farm</div>
          <div className="text-lg font-medium">{farm.name} — {farm.location}</div>
          <div className="text-sm text-slate-400">{latest ? `Updated ${new Date(latest.timestamp).toLocaleTimeString()}` : "Waiting for data..."}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500">{analysis.summary}</div>
          <button onClick={handleIrrigate} disabled={cooldownLeftMs>0} className={`px-3 py-2 rounded-lg text-white ${cooldownLeftMs>0? "bg-gray-400":"bg-green-600 hover:bg-green-700"}`}>Irrigate</button>
          <div className="text-xs text-slate-500">{cooldownLeftMs>0? `Cooldown ${formatCountdown(cooldownLeftMs)}` : "Ready"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OverviewCards latest={latest} thresholds={thresholds} />
        <div className="md:col-span-2 space-y-4">
          <AlertsPanel analysis={analysis} />
          <Charts history={history} />
        </div>
      </div>

      <ThresholdsPanel thresholds={thresholds} onSave={saveThresholds} />
    </div>
  );
}
