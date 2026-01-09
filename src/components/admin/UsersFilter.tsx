'use client';

import { useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  _count: { apiaries: number };
}

export default function UsersFilter({
  users,
  currentPage,
  totalPages,
}: {
  users: User[];
  currentPage: number;
  totalPages: number;
}) {
  const [search, setSearch] = useState('');
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>E-mail</th>
              <th>Bijenstanden</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td data-label="Naam">
                  {user.name}{' '}
                  <span style={{ color: 'green' }}>
                    {user.role === 'SUPERADMIN'
                      ? '(superadmin)'
                      : user.role === 'ADMIN'
                      ? '(admin)'
                      : ''}
                  </span>
                </td>
                <td data-label="E-mail">{user.email}</td>
                <td data-label="Bijenstanden">{user._count.apiaries}</td>
                <td data-label="Acties">
                  <Link href={`/admin/users/${user.id}`}>
                    <button className="btn btn--secondary btn--sm">
                      Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <Link
            href={`/admin/users?page=${currentPage > 1 ? currentPage - 1 : 1}`}
          >
            <button className="btn btn--secondary" disabled={currentPage === 1}>
              Vorige
            </button>
          </Link>
          <span className="pagination__text">
            Pagina {currentPage} van {totalPages}
          </span>
          <Link
            href={`/admin/users?page=${
              currentPage < totalPages ? currentPage + 1 : totalPages
            }`}
          >
            <button
              className="btn btn--secondary"
              disabled={currentPage === totalPages}
            >
              Volgende
            </button>
          </Link>
        </div>
      )}
    </>
  );
}
