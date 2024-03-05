'use client';

import { FC } from 'react';
import { logout } from '@/actions';
import { sidebarLinks, adminSidebarLinks } from '@/utils';
import { IoLogOutOutline } from 'react-icons/io5';
import { SidebarLink } from './SidebarLink';

interface SidebarItemsProps {
  isAdmin: boolean;
}

export const SidebarItems: FC<SidebarItemsProps> = ({ isAdmin }) => {
  return (
    <>
      {sidebarLinks.map((link, index) => (
        <SidebarLink key={index} {...link} />
      ))}

      {isAdmin && (
        <>
          <div className="w-full h-px bg-gray-200 my-10"></div>

          {adminSidebarLinks.map((link, index) => (
            <SidebarLink key={index} {...link} />
          ))}
        </>
      )}

      <button onClick={() => logout()} className="w-full sidebar-link">
        <IoLogOutOutline size={30} />
        <span>Salir</span>
      </button>
    </>
  );
};
