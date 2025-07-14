"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  UserIcon,
  BackwardIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = useMemo(
    () => [
      { name: "Dashboard", href: "/pages/main/admin/dashboard", icon: HomeIcon },
      { name: "Products", href: "/pages/main/admin/product/ShowProduct", icon: BookOpenIcon },
      { name: "Notification", href: "/pages/main/admin/notification", icon: BellIcon },
      { name: "Orders", href: "/pages/main/admin/orders", icon: ShoppingBagIcon },
      { name: "Send Email", href: "/pages/main/admin/sendEmail", icon: UserIcon },
    ],
    []
  );

  return (
    <div className="h-screen bg-white text-gray-800 flex flex-col p-4 w-full sticky top-0">
      {/* Logo */}
      <div className="text-2xl font-bold text-center py-6 text-primary tracking-wide">
        🌈 Rainbow
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 flex-grow">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-medium transition duration-200 no-underline
                ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-white hover:text-primary"
                }`}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Separator */}
      <div className="border-t my-4 border-gray-300" />

      {/* Back to customer */}
      <Link
        href="/pages/main/customer/dashboard"
        className="flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-medium hover:bg-white hover:text-primary transition duration-200 no-underline"
      >
        <BackwardIcon className="h-6 w-6" />
        <span>Customer Side</span>
      </Link>
    </div>
  );
}
