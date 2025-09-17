import React from "react";
import { motion } from "framer-motion";

export default function FarmCard({ farm, onOpen }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="p-4 rounded-2xl bg-white shadow cursor-pointer" onClick={onOpen}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Farm</div>
          <div className="font-medium">{farm.name}</div>
          <div className="text-xs text-slate-400">{farm.location}</div>
        </div>
        <div className="text-xs text-slate-400">Live</div>
      </div>

      <div className="mt-4 text-sm text-slate-600">Click to open live dashboard</div>
    </motion.div>
  );
}
