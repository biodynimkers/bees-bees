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
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Zoek op naam..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form__input search-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead className="table__head">
            <tr>
              <th className="table__head-cell">Naam</th>
              <th className="table__head-cell">E-mail</th>
              <th className="table__head-cell">Bijenstanden</th>
              <th className="table__head-cell">Acties</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="table__body-row">
                <td className="table__cell table__cell--name">{user.name}</td>
                <td className="table__cell table__cell--email">{user.email}</td>
                <td className="table__cell">{user._count.apiaries}</td>
                <td className="table__cell">
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-12)',
          }}
        >
          <Link
            href={`/admin/users?page=${currentPage > 1 ? currentPage - 1 : 1}`}
          >
            <button className="btn btn--secondary" disabled={currentPage === 1}>
              Vorige
            </button>
          </Link>
          <span style={{ color: 'var(--color-text-light)' }}>
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
