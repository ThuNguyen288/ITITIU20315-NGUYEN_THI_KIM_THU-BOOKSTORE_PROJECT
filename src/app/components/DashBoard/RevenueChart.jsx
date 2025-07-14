"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

// Pastel theme colors
const COLORS = {
  Cost: "#FF5733",     // Soft red
  Outfit: "#33FF57",   // Soft green
  Revenue: "#3357FF",  // Soft blue
};

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/admin/dashboard/RevenueChart");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-4 rounded-xl bg-white max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-primary mb-2">📈 Monthly Performance</h2>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey="Month"
            angle={-35}
            textAnchor="end"
            interval={0}
            height={50}
          />
          <YAxis
            domain={[0, (max) => Math.max(max * 1.1, 100_000_000)]} // Prevent overflow
            tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
          />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "14px", paddingTop: 8 }} />
          {Object.keys(COLORS).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[key]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
