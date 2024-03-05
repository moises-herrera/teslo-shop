'use client';

import { FC } from 'react';
import type { Role, User } from '@/interfaces';
import { changeUserRole } from '@/actions/users/change-user-role';

interface UsersTableProps {
  users: User[];
}

export const UsersTable: FC<UsersTableProps> = ({ users }) => {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Email
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Nombre completo
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Role
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map(({ id, name, email, role }) => (
          <tr
            key={id}
            className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {email}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {name}
            </td>
            <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              <select
                value={role}
                onChange={({ target: { value } }) => {
                  changeUserRole(id, value as Role);
                }}
                className="w-full p-2 text-sm text-gray-900"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
