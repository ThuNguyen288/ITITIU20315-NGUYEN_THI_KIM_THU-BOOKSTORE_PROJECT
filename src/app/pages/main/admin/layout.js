"use client"
import Sidebar from "@/app/components/AdminSidebar";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="grid-cols-5 grid">
            <Sidebar className = ""/>
            <div className="col-span-4">
                {children}
            </div>
        </div>
          
      </body>
    </html>
  );
}