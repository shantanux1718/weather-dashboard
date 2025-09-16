import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WeatherOverview from "./components/WeatherOverview";
import Environment from "./components/Environment";
import SoilLight from "./components/SoilLight";
import Charts from "./components/Charts";
import CustomerNav from "./components/CustomerNav";

const MAX_HISTORY = 20;

export default function App() {
  const customers = [
    { id: "farm-a", name: "Farm A", accent: "#0ea5e9" },
    { id: "orchard", name: "Orchard", accent: "#f59e0b" },
    { id: "greenhouse", name: "Greenhouse", accent: "#10b981" },
    { id: "test-site", name: "Test Site", accent: "#8b5cf6" },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const currentCustomer = customers[currentIdx];

  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const SSE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/stream";

  useEffect(() => {
    const es = new EventSource(SSE_URL);
    es.onopen = () => console.log("SSE connected");
    es.onerror = (err) => console.error("SSE error", err);
    es.onmessage = (evt) => {
      try {
        const json = JSON.parse(evt.data);
        setData(json);

        const flat = {
          time: new Date(json.timestamp || Date.now()).toLocaleTimeString(),
          airTemp: json.environment?.temp ?? null,
          soilTemp: json.soil?.temp ?? null,
          humidity: json.environment?.humidity ?? null,
          soilMoist: json.soil?.moisture ?? null,
          rain: json.weather?.rain ?? null,
          light: json.light?.lux ?? null,
        };

        setHistory((h) => {
          const next = [...h.slice(-(MAX_HISTORY - 1)), flat];
          return next;
        });
      } catch (e) {
        console.error("Failed to parse SSE data", e);
      }
    };
    return () => es.close();
  }, [SSE_URL]);

  const goPrev = () => setCurrentIdx((s) => (s - 1 + customers.length) % customers.length);
  const goNext = () => setCurrentIdx((s) => (s + 1) % customers.length);
  const onSelect = (idx) => setCurrentIdx(idx);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">🌤️ Smart Weather Station</h1>
          <p className="text-sm text-slate-600 mt-1">Multi-customer dashboards — live updates every 5s</p>
        </div>

        <CustomerNav
          customers={customers}
          currentIdx={currentIdx}
          onPrev={goPrev}
          onNext={goNext}
          onSelect={onSelect}
        />
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="mb-4">
          <div className="text-xs text-slate-500">Viewing dashboard for</div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ background: currentCustomer.accent }} />
            <div className="font-medium">{currentCustomer.name}</div>
            <div className="text-xs ml-2 text-slate-400">({currentCustomer.id})</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={currentCustomer.id + (data?.timestamp ?? "noData")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            layout
          >
            {data ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                <WeatherOverview data={data.weather} accent={currentCustomer.accent} />
                <Environment data={{ ...data.environment, sht1: data.sht1, sht2: data.sht2 }} accent={currentCustomer.accent} />
                <SoilLight data={{ ...data.soil, light: data.light }} accent={currentCustomer.accent} />

                <div className="col-span-1 md:col-span-3">
                  <Charts history={history} accent={currentCustomer.accent} />
                </div>
              </div>
            ) : (
              <div className="card text-center">
                <p>🔄 Waiting for server data...</p>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}
