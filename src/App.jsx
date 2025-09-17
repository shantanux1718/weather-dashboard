import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen.jsx";
import FarmList from "./components/FarmList.jsx";
import FarmDashboard from "./components/FarmDashboard.jsx";
import Settings from "./components/Settings.jsx";
import { API_BASE } from "./lib/config";

export default function App() {
  const [view, setView] = useState("loading"); // loading | list | dashboard | settings
  const [farms, setFarms] = useState([]);
  const [selectedFarmIdx, setSelectedFarmIdx] = useState(0);

  useEffect(() => {
    // show splash for a bit, then load farms
    let mounted = true;
    setTimeout(() => {
      fetch(`${API_BASE}/farms`)
        .then((r) => r.json())
        .then((data) => {
          if (!mounted) return;
          setFarms(Array.isArray(data) ? data : []);
          setView("list");
        })
        .catch((e) => {
          console.error("Failed to fetch farms:", e);
          // fallback to sample farms if server unavailable
          if (!mounted) return;
          setFarms([
            { id: "farm-a", name: "Farm A", location: "Unknown" },
            { id: "farm-b", name: "Farm B", location: "Unknown" },
          ]);
          setView("list");
        });
    }, 900); // short splash

    return () => {
      mounted = false;
    };
  }, []);

  const openDashboard = (idx) => {
    setSelectedFarmIdx(idx);
    setView("dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AnimatePresence mode="wait">
        {view === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingScreen onContinue={() => setView("list")} />
          </motion.div>
        )}

        {view === "list" && (
          <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="max-w-7xl mx-auto p-6">
              <header className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">🍃 Sugarcane Farm Manager</h1>
                  <p className="text-sm text-slate-600">Select a farm to open the live dashboard</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-white shadow" onClick={() => setView("settings")}>Settings</button>
                </div>
              </header>

              <FarmList farms={farms} onOpen={openDashboard} />
            </div>
          </motion.div>
        )}

        {view === "dashboard" && farms[selectedFarmIdx] && (
          <motion.div key={`dash-${farms[selectedFarmIdx].id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-7xl mx-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <button className="text-slate-600 text-sm mr-3" onClick={() => setView("list")}>← Back</button>
                  <h2 className="text-xl font-bold">{farms[selectedFarmIdx].name}</h2>
                  <div className="text-xs text-slate-500">{farms[selectedFarmIdx].location}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-white shadow" onClick={() => setView("settings")}>Settings</button>
                </div>
              </div>

              <FarmDashboard farm={farms[selectedFarmIdx]} apiBase={API_BASE} />
            </div>
          </motion.div>
        )}

        {view === "settings" && (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-4xl mx-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <button className="text-slate-600 text-sm mr-3" onClick={() => setView("list")}>← Back</button>
                  <h2 className="text-xl font-bold">Settings</h2>
                  <div className="text-xs text-slate-500">App preferences and profiles</div>
                </div>
              </div>

              <Settings />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
