"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";

const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF5"];

export default function MonthlyOrdersChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/dashboard/MonthlyOrdersChart");
        const rawData = response.data;

        console.log("API Data:", rawData);

        // Gộp tổng số đơn hàng theo từng tháng
        const aggregatedData = rawData.reduce((acc, { Month, TotalOrders }) => {
          const existingMonth = acc.find((entry) => entry.Month === Month);
          if (existingMonth) {
            existingMonth.TotalOrders += TotalOrders;
          } else {
            acc.push({ Month, TotalOrders });
          }
          return acc;
        }, []);

        console.log("Formatted Data:", aggregatedData);

        setData(aggregatedData);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="Month"/>
        <YAxis/>
        <Tooltip />        
        <Bar dataKey="TotalOrders" fill="#4caf50" name="Total Orders" />
        <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: "14px" }} />

      </BarChart>
    </ResponsiveContainer>
  );
}
