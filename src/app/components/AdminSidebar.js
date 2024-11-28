import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HomeIcon, BookOpenIcon, ShoppingBagIcon, UserIcon, BackwardIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  const [active, setActive] = useState('');

  const menuItems = [
    { name: 'Dashboard', href: './dashboard', icon: HomeIcon },
    { name: 'Products', href: './product', icon: BookOpenIcon },
    { name: 'Orders', href: '#', icon: ShoppingBagIcon },
    { name: 'Account', href: '#', icon: UserIcon },
    { name: '', href: '../customer/dashboard', icon: BackwardIcon },

  ];

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <div className=" h-screen bg-gray-800 text-white">
      <div className="flex flex-col items-start p-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center p-2 rounded-lg w-full mb-2 ${
              pathname.startsWith(item.href)
                ? 'bg-indigo-600 text-white'  // Active state when the route matches
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="h-6 w-6 mr-2" />
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
