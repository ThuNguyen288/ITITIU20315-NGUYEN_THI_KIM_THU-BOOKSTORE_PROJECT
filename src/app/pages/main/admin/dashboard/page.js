"use client";

import MonthlyOrdersChart from "@/app/components/DashBoard/MonthlyOrdersChart";
import RevenueChart from "@/app/components/DashBoard/RevenueChart";
import TopSell from "@/app/components/DashBoard/TopSell";
import WeeklyRevenueChart from "@/app/components/DashBoard/WeeklyRevenue_BarChart";
import { Paper } from "@mui/material";
import ProductSalesPieChart from "@/app/components/DashBoard/WeeklyProducts";
import Recommendation from "@/app/components/DashBoard/Recomendation";
import RecommendationStats from "@/app/components/DashBoard/RecomendationStats";
import TrendingTags from "@/app/components/DashBoard/TagTrending";


export default function DashboardAdmin() {
  return (
      <main className="flex-1 p-4 overflow-auto">
        <h3 className="text-2xl font-semibold text-center mb-4">Dashboard</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Paper elevation={3} className="p-4">
            <TopSell />
          </Paper>
          <Paper elevation={3} className="p-4">
            <Recommendation />
          </Paper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Paper elevation={3} className="p-4">
            <RecommendationStats />
          </Paper>
          <Paper elevation={3} className="p-4">
            <TrendingTags/>
          </Paper>
        </div>

        <h5 className="text-xl font-semibold text-center mb-4">Weekly Revenue</h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Paper elevation={3} className="md:col-span-3 p-4">
            <WeeklyRevenueChart />
          </Paper>
          <Paper elevation={3} className="p-4">
            <ProductSalesPieChart />
          </Paper>
        </div>

        <h5 className="text-xl font-semibold text-center mb-4">Monthly Revenue</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
          <Paper elevation={3} className="p-4">
            <MonthlyOrdersChart />
          </Paper>
          <Paper elevation={3} className="p-4">
            <RevenueChart />
          </Paper>
        </div>
      </main>

  );
}
