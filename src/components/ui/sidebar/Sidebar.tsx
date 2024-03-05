'use client';

import Link from 'next/link';
import {
  IoCloseOutline,
  IoLogInOutline,
  IoSearchOutline,
} from 'react-icons/io5';
import './Sidebar.css';
import { useUIStore } from '@/store';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { SidebarItems } from './SidebarItems';

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeSideMenu = useUIStore((state) => state.closeSideMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div>
      {isSideMenuOpen && (
        <>
          {/* Background black */}
          <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
          {/* Blur */}
          <div
            onClick={closeSideMenu}
            className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
          ></div>
        </>
      )}

      {/* Sidemenu */}
      <nav
        className={clsx(
          'fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300',
          {
            'translate-x-full': !isSideMenuOpen,
            'translate-x-0': isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={closeSideMenu}
        />

        {/* Search input */}
        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded px-10 py-1 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Menu */}
        {isAuthenticated ? (
          <SidebarItems isAdmin={isAdmin} />
        ) : (
          <Link
            href="/auth/login"
            onClick={closeSideMenu}
            className="sidebar-link"
          >
            <IoLogInOutline size={30} />
            <span>Ingresar</span>
          </Link>
        )}
      </nav>
    </div>
  );
};
