'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  _count: {
    apiaries: number;
  };
}

interface UsersFilterProps {
  users: User[];
}

export default function UsersFilter({ users }: UsersFilterProps) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <input
          type="text"
          placeholder="Zoek op naam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form__input"
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead className="table__head">
            <tr>
              <th className="table__head-cell">Naam</th>
              <th className="table__head-cell">E-mail</th>
              <th className="table__head-cell">Rol</th>
              <th className="table__head-cell">Bijenstanden</th>
              <th className="table__head-cell">Acties</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="table__body-row">
                <td className="table__cell table__cell--name">{user.name}</td>
                <td className="table__cell table__cell--email">{user.email}</td>
                <td className="table__cell">
                  <span className={`badge badge--${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td className="table__cell">{user._count.apiaries}</td>
                <td className="table__cell">
                  <a href={`/admin/users/${user.id}`}>
                    <button className="btn btn--secondary btn--sm">
                      Details
                    </button>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
