import { motion } from "framer-motion";

export default function SoilLight({ data }) {
  const moistPct = Math.min(100, Math.max(0, data.moisture));
  return (
    <motion.section
      className="p-4 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      layout
    >
      <h2 className="text-lg font-semibold mb-3">Soil & Light</h2>

      <div className="space-y-3">
        <div>
          <div className="text-sm text-gray-500">Soil moisture</div>
          <div className="text-2xl font-bold">{data.moisture.toFixed(1)} %</div>
          <div className="w-full bg-gray-100 rounded h-2 mt-2 overflow-hidden">
            <div style={{ width: `${moistPct}%` }} className="h-2 rounded bg-green-500 transition-all" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Soil Temp</div>
            <div className="text-lg font-medium">{data.temp.toFixed(1)} °C</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Conductivity</div>
            <div className="text-lg font-medium">{data.cond} µS/cm</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Light</div>
          <div className="text-lg font-medium">{data.light?.lux.toFixed(2)} lux</div>
        </div>
      </div>
    </motion.section>
  );
}
