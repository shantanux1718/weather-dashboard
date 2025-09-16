import React from "react";
import { motion } from "framer-motion";

export default function CustomerNav({ customers, currentIdx, onPrev, onNext, onSelect }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        className="p-2 rounded-xl bg-white shadow hover:shadow-md transition"
        aria-label="Previous customer"
      >
        ←
      </button>

      <div className="bg-white rounded-xl shadow px-3 py-2 flex items-center gap-3">
        <select
          value={currentIdx}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="bg-transparent outline-none text-sm"
        >
          {customers.map((c, idx) => (
            <option key={c.id} value={idx}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          {customers.map((c, i) => (
            <motion.div
              key={c.id}
              animate={{ scale: i === currentIdx ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: c.accent,
                border: i === currentIdx ? "2px solid rgba(0,0,0,0.08)" : "none",
              }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="p-2 rounded-xl bg-white shadow hover:shadow-md transition"
        aria-label="Next customer"
      >
        →
      </button>
    </div>
  );
}
