import React from "react";
import FarmCard from "./FarmCard.jsx";

export default function FarmList({ farms = [], onOpen }) {
  if (!farms || farms.length === 0) {
    return <div className="card">No farms found.</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {farms.map((f, i) => (
        <FarmCard key={f.id} farm={f} onOpen={() => onOpen(i)} />
      ))}
    </div>
  );
}
