"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { HomeIcon, ShoppingBagIcon, BackwardIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = useMemo(
    () => [
      { name: "Profile", href: "/pages/main/customer/account/profile", icon: HomeIcon },
      { name: "Password", href: "/pages/main/customer/account/password", icon: KeyIcon },
      { name: "Orders", href: "/pages/main/customer/account/orders", icon: ShoppingBagIcon },
    ],
    []
  );

  return (
<div className="fixed top-0 left-0 h-screen w-72 bg-transparent text-black flex flex-col p-4 border-r-2 z-40 mt-32">
      {/* MENU ITEMS */}
      <div className="flex flex-col flex-grow mt-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 no-underline ${
                isActive
                  ? "bg-gradient-to-r from-sky-400 to-blue-500 shadow-md"
                  : "hover:bg-sky-200"
              }`}
            >
              <item.icon className="h-7 w-7 mr-4 text-black" />
              <span className="text-lg text-black">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
