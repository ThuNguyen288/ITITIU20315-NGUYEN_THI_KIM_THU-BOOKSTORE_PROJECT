"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { HomeIcon, BookOpenIcon, ShoppingBagIcon, UserIcon, BackwardIcon, BellIcon } from "@heroicons/react/24/outline";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = useMemo(
    () => [
      { name: "Dashboard", href: "/pages/main/admin/dashboard", icon: HomeIcon },
      { name: "Products", href: "/pages/main/admin/product/ShowProduct", icon: BookOpenIcon },
      { name: "Notification", href: "/pages/main/admin/notification", icon: BellIcon },
      { name: "Orders", href: "/pages/main/admin/orders", icon: ShoppingBagIcon },
      { name: "Account", href: "/account", icon: UserIcon },
    ],
    []
  );

  return (
    <div className="h-screen w-72 bg-gray-900 text-white flex flex-col p-4 shadow-lg sticky top-0">
      {/* LOGO / TITLE */}
      <div className="text-xl font-bold text-center py-4 border-b border-gray-700">
        RAINBOW BOOKSTORE
      </div>

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
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 shadow-md"
                  : "hover:bg-gray-800"
              }`}
            >
              <item.icon className="h-7 w-7 mr-4 text-white" />
              <span className="text-lg text-white">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* SEPARATOR */}
      <div className="border-t border-gray-700 my-4"></div>

      {/* BACK TO CUSTOMER */}
      <Link
        href="/pages/main/customer/dashboard"
        className="flex items-center p-3 rounded-xl hover:bg-gray-800 transition-all duration-200 no-underline"
      >
        <BackwardIcon className="h-7 w-7 mr-4 text-white" />
        <span className="text-lg text-white">Back to Customer</span>
      </Link>
    </div>
  );
}
