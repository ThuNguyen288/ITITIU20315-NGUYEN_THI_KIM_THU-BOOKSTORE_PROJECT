'use client';

import { useState } from 'react';
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
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext'; // Import the context

// Books' categories
const books = [
  { name: 'Novel', href: '#', icon: BookmarkIcon },
  { name: 'Fiction', href: '#', icon: BookOpenIcon },
  { name: 'Comic', href: '#', icon: BookOpenIcon },
];

// Pens' categories
const Pens = [
  { name: 'Pen', href: '#', icon: PencilIcon },
  { name: 'Pencil', href: '#', icon: PencilIcon },
  { name: 'Color', href: '#', icon: PencilIcon },
];

// Header Begin
export default function Header() {
  const { isAuthenticated, login, logout } = useAuth(); // Use auth context
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Scale for mobile screen

  const handleLogout = () => {
    logout();
    // Optional: Redirect to the home or login page
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
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {/* Books */}
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              Books
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>
            <PopoverPanel
              transition
              className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5"
            >
              <div className="p-4">
                {books.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                    </div>
                    <div className="flex-auto">
                      <a href={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          {/* Pens */}
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              Pens
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>
            <PopoverPanel
              transition
              className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5"
            >
              <div className="p-4">
                {Pens.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                    </div>
                    <div className="flex-auto">
                      <a href={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Stationaries
          </a>
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!isAuthenticated ? (
            <Link href="/pages/login" className="flex items-center text-sm font-semibold text-gray-900 hover:text-indigo-600">
              <UserIcon className="h-6 w-6 mr-2" />
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-semibold text-gray-900 hover:text-indigo-600"
            >
              <UserIcon className="h-6 w-6 mr-2" />
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
