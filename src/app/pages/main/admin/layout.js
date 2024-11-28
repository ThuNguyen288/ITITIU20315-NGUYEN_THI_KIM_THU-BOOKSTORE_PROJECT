"use client"
import Sidebar from "@/app/components/AdminSidebar";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="grid-cols-4 grid">
            <Sidebar className = ""/>
            <div className="col-span-3">
                {children}
            </div>
        </div>
          
      </body>
    </html>
  );
}