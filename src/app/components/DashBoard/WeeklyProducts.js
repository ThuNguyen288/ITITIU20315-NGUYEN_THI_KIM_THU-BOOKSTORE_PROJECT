"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]; // Màu cho Book, Pen, Other

export default function ProductSalesPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/dashboard/WeeklyProducts");
        setData(response.data.map(item => ({
          Category: item.Category,  // Giữ nguyên
          TotalSold: Number(item.TotalSold)  // Chuyển string → number
        })));
        
      } catch (error) {
        console.error("❌ Lỗi lấy dữ liệu sản phẩm:", error);
      }
    }
    fetchData();
  }, []);
  console.log("Product Sales Data:", data);
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="TotalSold"
          nameKey="Category"
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
