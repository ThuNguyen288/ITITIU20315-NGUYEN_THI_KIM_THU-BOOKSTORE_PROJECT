"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";

const COLORS = { Cost: "#FF5733", Outfit: "#33FF57", Revenue: "#3357FF" };

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/dashboard/RevenueChart");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="Month"/>
        <YAxis />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: "14px", marginRight: "20px" }} />

        {Object.keys(COLORS).map((key) => (
          <Line key={key} type="monotone" dataKey={key} stroke={COLORS[key]} name={key} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
