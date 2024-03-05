import { SidebarItem } from '@/interfaces';
import {
  IoPeopleOutline,
  IoPersonOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';

/**
 * Sidebar links.
 */
export const sidebarLinks: SidebarItem[] = [
  {
    href: '/profile',
    icon: <IoPersonOutline size={30} />,
    label: 'Perfil',
  },
  {
    href: '/orders',
    icon: <IoTicketOutline size={30} />,
    label: 'Ordenes',
  },
];

/**
 * Admin sidebar links.
 */
export const adminSidebarLinks: SidebarItem[] = [
  {
    href: '/admin/products',
    icon: <IoShirtOutline size={30} />,
    label: 'Productos',
  },
  {
    href: '/admin/orders',
    icon: <IoTicketOutline size={30} />,
    label: 'Ordenes',
  },
  {
    href: '/admin/users',
    icon: <IoPeopleOutline size={30} />,
    label: 'Usuarios',
  },
];
