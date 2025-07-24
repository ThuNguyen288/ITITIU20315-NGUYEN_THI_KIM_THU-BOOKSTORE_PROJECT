"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const pastelColors = {
  correct: "#74C0FC", // primary.dark
  purchase: "#8DECB4", // secondary.dark
  cart: "#FFF1A8", // accent.yellow
  click: "#D8B4FE", // accent.purple
};

export default function RecommendationStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/evaluate")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const getActionValue = (type) => {
    return data?.ActionStats?.find((a) => a.ActionType === type)?.Total || 0;
  };

  const combinedData = data
    ? [
        {
          name: "Correct Recommendations",
          value: data.TotalCorrectRecommendations || 0,
          fill: pastelColors.correct,
        },
        {
          name: "Purchases",
          value: getActionValue("purchase"),
          fill: pastelColors.purchase,
        },
        {
          name: "Added to Cart",
          value: getActionValue("add_to_cart"),
          fill: pastelColors.cart,
        },
        {
          name: "Clicks",
          value: getActionValue("click"),
          fill: pastelColors.click,
        },
      ]
    : [];

  return (
    <div
      className="py-6 rounded-2xl shadow-md max-w-full mx-auto space-y-6 px-3 "
      style={{
        backgroundColor: "#FFF9F0", // background.surface
        color: "#3D3D3D", // neutral.dark
      }}
    >
      <h2 className="text-2xl font-bold text-[#74C0FC] text-center">📊 Recommendation System Effectiveness</h2>

      <p className="text-sm text-gray-700">
        The chart below compares the number of <strong>correct recommendations</strong> (products suggested by the system that users actually showed interest in) with real user behavior:
        <br />
        – Including purchases, adding to cart, and clicking on products.
      </p>

      <div className="h-72 bg-white rounded-xl p-4 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={combinedData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" isAnimationActive={true}>
              {combinedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data && (
        <div className="text-center text-sm text-gray-600">
          <p><strong>Precision@{4}</strong>: {data.PrecisionAtK}</p>
          <p><strong>Recall@{4}</strong>: {data.RecallAtK}</p>
          <p>Evaluated on <strong>{data.UsersEvaluated}</strong> users</p>
        </div>
      )}
      <p className="text-xs text-gray-500 pt-2">
        Data is based on the <code>ground_truth_logs</code> table. The <strong>“Correct Recommendations”</strong> column represents products suggested by the system that match user interests or actions.
      </p>
    </div>
  );
}
