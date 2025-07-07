"use client";

import Sidebar from "@/app/components/Sidebar";

export default function CustomerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar cố định */}
      <aside className="w-72">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
}
