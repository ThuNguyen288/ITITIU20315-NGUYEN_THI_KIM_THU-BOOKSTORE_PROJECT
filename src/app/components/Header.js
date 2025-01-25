'use client';
import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Logo from '/public/Logo/logo.png';
import {
  Bars3Icon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext'; // Import the context
import SearchBar from './SearchBar';

const accountGroup = [
  { name: 'Account', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Orders', href: '/pages/main/customer/orders' },
  { name: 'Logout', href: '#' },
];

export default function Header() {
  const { isAuthenticated, logout } = useAuth(); // Sử dụng context
  const [roleId, setRoleId] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Quản lý trạng thái sidebar

  useEffect(() => {
    const storedRoleId = localStorage.getItem('roleId');
    if (storedRoleId) {
      setRoleId(Number(storedRoleId)); // Lấy roleId từ localStorage
    }
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.clear(); // Remove all items from localStorage
  };

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-100 items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1 items-center">
          <a href="/pages/main/customer/dashboard" className="-m-1.5 p-1.5 flex items-center no-underline">
            <span className="sr-only">Rainbow</span>
            <Image alt="Your Company" src={Logo} className="h-8 w-auto mr-2" />
            <h5 className="text-sm align-middle text-black my-auto font-semibold">Rainbow</h5>
          </a>
        </div>


        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)} // Mở sidebar
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/pages/main/customer/products" className="text-sm font-semibold text-gray-900 no-underline">All Products</Link>
          <Link href="#" className="text-sm font-semibold text-gray-900 no-underline">Books</Link>
          <Link href="#" className="text-sm font-semibold text-gray-900 no-underline">Pens</Link>
          <Link href="#" className="text-sm font-semibold text-gray-900 no-underline">Others</Link>
        </div>

        {/* User Menu */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!isAuthenticated ? (
            <Link href="/pages/auth/login" className="flex items-center text-sm font-semibold text-gray-900 hover:text-indigo-600">
              <UserIcon className="h-6 w-6 mr-2" />
              Login
            </Link>
          ) : (
            <div className='flex'>
              <SearchBar/>
              <Link href="/pages/main/customer/cart" className="flex items-center text-sm font-semibold text-gray-900">
                <ShoppingBagIcon className="h-6 w-6 text-gray-900" />
              </Link>
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-gray-300 hover:bg-gray-50">
                  <UserIcon className="h-6 w-6" />
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="py-1">
                    {roleId === 2 && (
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="/pages/main/admin/dashboard"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block w-full text-left p-2 rounded-md no-underline text-black`}
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
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left p-2 rounded-md`}
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
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left p-2 rounded-md no-underline text-black`}
                            >
                              {item.name}
                            </Link>
                          )}
                        </MenuItem>
                      )
                    )}
                  </div>
                </MenuItems>
              </Menu>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)} // Đóng sidebar khi click ra ngoài
      ></div>
      <div
        className={`fixed inset-y-0 right-0 z-50 transform bg-white transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '250px' }}
      >
        <div className="flex justify-between p-4">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 px-4">
          <Link href="/pages/main/customer/products" className="text-sm font-semibold text-gray-900">All Products</Link>
          <Link href="#" className="text-sm font-semibold text-gray-900">Books</Link>
          <Link href="#" className="text-sm font-semibold text-gray-900">Pens</Link>
          <Link href="#" className="text-sm font-semibold text-gray-900">Others</Link>
          {!isAuthenticated ? (
            <Link href="/pages/auth/login" className="text-sm font-semibold text-gray-900">Login</Link>
          ) : (
            <div className="flex flex-col space-y-4">
              <hr></hr>
              <Link href="/pages/main/customer/cart" className="text-sm font-semibold text-gray-900">Cart</Link>
              <button onClick={handleLogout} className="text-sm font-semibold text-gray-900 text-left">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
