"use client";

import Sidebar from "@/app/components/AdminSidebar";
import MonthlyOrdersChart from "@/app/components/DashBoard/MonthlyOrdersChart";
import RevenueChart from "@/app/components/DashBoard/RevenueChart";
import TopSell from "@/app/components/DashBoard/TopSell";
import WeeklyRevenueChart from "@/app/components/DashBoard/WeeklyRevenue_BarChart";
import { Paper } from "@mui/material";
import ProductSalesPieChart from "@/app/components/DashBoard/WeeklyProducts";

export default function DashboardAdmin() {
  return (
    <div className="container">
        <h3 className="mx-auto text-center p-4">DashBoard</h3>
        <TopSell/>
        <h5 className="mx-auto text-center p-4">Weekly Revenue</h5>
        <div className="grid grid-cols-4 gap-1">
            <div className="col-span-3">
                <WeeklyRevenueChart/>           
            </div>
            <div className="">
                <ProductSalesPieChart/>
            </div>
        </div>
        <h5 className="mx-auto text-center p-4">Monthly Revenue</h5>
        <div className="grid grid-cols-4 gap-1">
            <div className="col-span-2">
                <MonthlyOrdersChart/>            </div>
            <div className="col-span-2">
                <RevenueChart/>
            </div>
        </div>
    </div>
  );
}
