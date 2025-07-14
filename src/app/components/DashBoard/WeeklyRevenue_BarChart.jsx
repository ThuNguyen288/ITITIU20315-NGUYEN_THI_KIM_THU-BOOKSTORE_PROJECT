"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

export default function WeeklyRevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/admin/dashboard/WeeklyRevenue");
        const apiData = response.data;

        // Danh sách thứ trong tuần (Monday -> Sunday)
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        // Chuyển đổi dữ liệu API thành object để dễ tra cứu
        const dataMap = apiData.reduce((acc, item) => {
          acc[item.Day] = item;
          return acc;
        }, {});

        // Tạo dataset luôn có đủ 7 ngày
        const formattedData = daysOfWeek.map((day) => ({
          day,
          cost: dataMap[day]?.Cost || 0,
          outfit: dataMap[day]?.Outfit || 0,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="90%" height={200}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="none" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: "14px", marginRight: "20px" }} />
        <Bar dataKey="cost" stackId="a" fill="#ff4d4d" name="Cost" />
        <Bar dataKey="outfit" stackId="a" fill="#4caf50" name="Outfit" />
      </BarChart>
    </ResponsiveContainer>
  );
}
