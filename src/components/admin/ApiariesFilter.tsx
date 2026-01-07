'use client';

import { useState } from 'react';
import Link from 'next/link';
import ApiariesTable from './ApiariesTable';

interface Apiary {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: { id: string; name: string; email: string };
  _count: { hives: number };
}

export default function ApiariesFilter({
  apiaries,
  currentPage,
  totalPages,
  currentPath,
}: {
  apiaries: Apiary[];
  currentPage: number;
  totalPages: number;
  currentPath: string;
}) {
  const [search, setSearch] = useState('');

  const filteredApiaries = apiaries.filter(apiary =>
    apiary.name.toLowerCase().includes(search.toLowerCase()) ||
    apiary.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="section-header">
        <Link href="/admin" className="back-link">
          ←
        </Link>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Zoek op naam of eigenaar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form__input search-input"
          />
        </div>
      </div>

      <ApiariesTable
        apiaries={filteredApiaries as any}
        showUser={true}
        currentPath={currentPath}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}
