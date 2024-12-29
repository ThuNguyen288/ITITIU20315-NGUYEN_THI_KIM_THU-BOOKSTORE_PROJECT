'use client'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useState } from 'react';
import { useEffect } from 'react';
import Logo from '/public/Logo/logo.png';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  Bars3Icon,
  BookmarkIcon,
  BookOpenIcon,
  ChartPieIcon,
  ShoppingBagIcon,
  UserIcon,
  PencilIcon,
  XMarkIcon,
  ChevronDownIcon

} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext'; // Import the context


const accountGroup = [
  { name: 'Account', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Logout', href: '#' },

]

// Header Begin
export default function Header() {
  const { isAuthenticated, logout } = useAuth(); // Sử dụng context
  const [roleId, setRoleId] = useState(0);

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
        {/* Logo Start */}
        <div className="flex lg:flex-1 logo">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image alt="Your Company" src={Logo} className="h-8 w-auto" />
          </a>
        </div>
        {/* Logo end */}

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/pages/main/customer/products" className="text-sm/6 font-semibold text-gray-900">
            All Products
          </Link>
          <Link href="#" className="text-sm/6 font-semibold text-gray-900">
            Books
          </Link>
          <Link href="#" className="text-sm/6 font-semibold text-gray-900">
            Pens
          </Link>
          <Link href="#" className="text-sm/6 font-semibold text-gray-900">
            Others
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!isAuthenticated ? (
            <Link href="/pages/auth/login" className="flex items-center text-sm font-semibold text-gray-900 hover:text-indigo-600">
              <UserIcon className="h-6 w-6 mr-2" />
              Login
            </Link>
          ) : (
            <div className='flex'>
              <Link href="/pages/main/customer/cart" className="flex items-center text-sm font-semibold text-gray">
                  <ShoppingBagIcon className="h-6 w-6 text-gray-900" />
              </Link>
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-gray-300 hover:bg-gray-50">
                  <UserIcon className="h-6 w-6" />
                </MenuButton>
                <MenuItems
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                  <div className="py-1">
                    {roleId === 2 && (
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href="/pages/main/admin/dashboard"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left p-2 rounded-md`}
                            >
                              Admin
                            </Link>
                          )}
                        </MenuItem>
                    )}
                    {accountGroup.map((item) =>
                      item.name === 'Logout' ? (
                        <MenuItem key={item.name}>
                          {({active}) => (
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
                          {({active}) => (
                            <Link
                              href={item.href}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left p-2 rounded-md`}
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
    </header>
  );
}
