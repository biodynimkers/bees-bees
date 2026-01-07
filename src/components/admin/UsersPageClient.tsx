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

export default function UsersPageClient({
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
    <section className="section ">
      <div className="container">
        <div className="section-header">
          <Link href="/admin" className="back-link">
            ←
          </Link>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Zoek op naam..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form__input search-input"
            />
          </div>
        </div>

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
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user._count.apiaries}</td>
                  <td>
                    <Link href={`/admin/users/${user.id}`}>
                      <button className="btn btn--small">Bekijk</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {currentPage > 1 && (
              <Link href={`/admin/users?page=${currentPage - 1}`}>
                <button className="btn btn--secondary">Vorige</button>
              </Link>
            )}
            <span>
              Pagina {currentPage} van {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link href={`/admin/users?page=${currentPage + 1}`}>
                <button className="btn btn--secondary">Volgende</button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
