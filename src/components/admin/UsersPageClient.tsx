'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import SearchInput from '../shared/SearchInput';

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
  search: initialSearch = '',
}: {
  users: User[];
  currentPage: number;
  totalPages: number;
  search?: string;
}) {
  const [search, setSearch] = useState(initialSearch);

  const router = useRouter();
  const searchParams = useSearchParams();

  // const filteredUsers = users.filter(user =>
  //   user.name.toLowerCase().includes(search.toLowerCase())
  // );
  const debouncedSearchUpdate = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/admin/users?${params.toString()}`);
  }, 300);

  return (
    <section className="home-features">
      <div className="container">
        <div className="section-header">
          <div className="filters">
            <SearchInput
              value={search}
              onChange={(value: string) => {
                setSearch(value);
                debouncedSearchUpdate(value);
              }}
              placeholder={'Zoek op naam of e-mailadres...'}
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
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    {user.name}{' '}
                    <span style={{ color: 'green' }}>
                      {user.role === 'SUPERADMIN'
                        ? '(superadmin)'
                        : user.role === 'ADMIN'
                        ? '(admin)'
                        : ''}
                    </span>
                  </td>
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
