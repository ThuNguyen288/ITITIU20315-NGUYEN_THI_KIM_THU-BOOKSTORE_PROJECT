'use client';
import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Logo from '/public/Logo/logo.png';
import { Bars3Icon, ShoppingBagIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext'; // Import the context
import SearchBar from './SearchBar';
import { useRouter } from 'next/navigation';

const accountGroup = [
  { name: 'Account', href: '/pages/main/customer/account/profile' },
  { name: 'Logout', href: '#' },
];

export default function Header() {
  const { isAuthenticated, logout } = useAuth(); // Sử dụng context
  const [roleId, setRoleId] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Quản lý trạng thái sidebar
  const router = useRouter();

  // Lấy roleId từ localStorage nếu đã lưu
  useEffect(() => {
    const storedRoleId = localStorage.getItem('roleId');
    if (storedRoleId) {
      setRoleId(Number(storedRoleId)); // Lấy roleId từ localStorage
    }
  }, []);

  // Hàm đăng xuất
  const handleLogout = () => {
    logout();
    localStorage.clear(); // Xóa tất cả thông tin trong localStorage
    router.push("/")
  };

  return (
    <header className="bg-white fixed z-50 w-full shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/pages/main/customer/dashboard" className="flex items-center gap-2 no-underline">
              <Image src={Logo} alt="Rainbow Logo" className="h-8 w-auto" />
              <h5 className="text-base font-medium text-gray-800">Rainbow</h5>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/pages/main/customer/products" className="text-sm font-medium text-gray-600 hover:text-primary no-underline">All Products</Link>
            <Link href="/pages/main/customer/products/books" className="text-sm font-medium text-gray-600 hover:text-primary no-underline">Books</Link>
            <Link href="/pages/main/customer/products/pens" className="text-sm font-medium text-gray-600 hover:text-primary no-underline">Pens</Link>
            <Link href="/pages/main/customer/products/others" className="text-sm font-medium text-gray-600 hover:text-primary no-underline">Others</Link>
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <SearchBar />
            {!isAuthenticated ? (
              <Link href="/pages/auth/login" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary no-underline">
                <UserIcon className="h-5 w-5" />
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/pages/main/customer/cart" className="text-gray-600 hover:text-primary">
                  <ShoppingBagIcon className="h-5 w-5" />
                </Link>
                <Menu as="div" className="relative">
                  <MenuButton className="p-2 bg-white border rounded-full hover:ring-2 hover:ring-primary transition">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                    {roleId === 2 && (
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="/pages/main/admin/dashboard"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-accent-yellow' : ''} no-underline text-zinc-700`}
                          >
                            Admin
                          </Link>
                        )}
                      </MenuItem>
                    )}
                    {accountGroup.map((item) =>
                      item.name === 'Logout' ? (
                        <MenuItem key={item.name}>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-accent-pink' : ''}`}
                            >
                              {item.name}
                            </button>
                          )}
                        </MenuItem>
                      ) : (
                        <MenuItem key={item.name}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={`block px-4 py-2 text-sm ${active ? 'bg-accent-purple' : ''} no-underline text-zinc-700`}
                            >
                              {item.name}
                            </Link>
                          )}
                        </MenuItem>
                      )
                    )}
                  </MenuItems>
                </Menu>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md bg-primary text-white hover:bg-primary-dark transition"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay (Mobile) */}
      <div
        className={`fixed inset-0 z-40 bg-gray-800 bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Drawer (Mobile) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white transform transition-transform lg:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-600">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-4 px-4 py-6">
          <Link href="/pages/main/customer/products" className="text-sm font-medium text-gray-700">All Products</Link>
          <Link href="#" className="text-sm font-medium text-gray-700">Books</Link>
          <Link href="#" className="text-sm font-medium text-gray-700">Pens</Link>
          <Link href="#" className="text-sm font-medium text-gray-700">Others</Link>
          {!isAuthenticated ? (
            <Link href="/pages/auth/login" className="text-sm font-medium text-gray-700">Login</Link>
          ) : (
            <>
              <hr />
              <Link href="/pages/main/customer/cart" className="text-sm font-medium text-gray-700">Cart</Link>
              <button onClick={handleLogout} className="text-sm font-medium text-left text-gray-700">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
