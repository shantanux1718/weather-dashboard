import React from "react";

export default function CustomerNav({ customers = [], currentIdx = 0, onPrev, onNext, onSelect }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onPrev} className="p-2 rounded-xl bg-white shadow">←</button>

      <div className="bg-white rounded-xl shadow px-3 py-2 flex items-center gap-3">
        <select
          value={currentIdx}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="bg-transparent outline-none text-sm"
        >
          {customers.map((c, idx) => (
            <option key={c.id} value={idx}>{c.name}</option>
          ))}
        </select>
      </div>

      <button onClick={onNext} className="p-2 rounded-xl bg-white shadow">→</button>
    </div>
  );
}
