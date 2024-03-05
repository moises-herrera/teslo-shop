'use client';

import { FC } from 'react';
import { SidebarItem } from '@/interfaces';
import { useUIStore } from '@/store';
import Link from 'next/link';

export const SidebarLink: FC<SidebarItem> = ({ href, icon, label }) => {
  const closeSideMenu = useUIStore((state) => state.closeSideMenu);

  return (
    <Link
      key={href}
      href={href}
      onClick={closeSideMenu}
      className="sidebar-link"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
