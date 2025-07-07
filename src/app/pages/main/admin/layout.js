'use client';
import AdminSidebar from "@/app/components/AdminSidebar";

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar cố định */}
      <aside className="hidden md:block w-64 bg-white shadow-lg border-r min-h-screen">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
}
