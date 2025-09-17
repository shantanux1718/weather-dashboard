import React from "react";
import { motion } from "framer-motion";

export default function LoadingScreen({ onContinue }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="bg-white p-8 rounded-3xl shadow-xl max-w-xl w-full text-center">
        <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-5xl mb-4">🌱</motion.div>
        <h1 className="text-2xl font-bold">Sugarcane Farm Dashboard</h1>
        <p className="text-slate-600 mt-2">Real-time farm telemetry — beautifully visualized</p>

        <div className="mt-6 flex justify-center gap-3">
          <button onClick={onContinue} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow">Enter App</button>
        </div>
      </motion.div>
    </div>
  );
}
