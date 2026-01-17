'use client';

import { useState } from 'react';
import Link from 'next/link';
import HivesTable from './HivesTable';

interface Hive {
  id: number;
  name: string;
  type: string;
  colonyType: string;
  createdAt: Date;
  updatedAt: Date;
  apiaryId: number;
  apiary?: {
    id: number;
    name: string;
    user: { id: string; name: string };
    userId: string;
  };
  _count: { observations: number };
}

export default function HivesFilter({
  hives,
  currentPage,
  totalPages,
  currentPath,
  showApiary = true,
  showUser = true,
  search: initialSearch = '',
  typeFilter: initialType = '',
  colonyFilter: initialColony = '',
  types,
  colonies,
}: {
  hives: Hive[];
  currentPage: number;
  totalPages: number;
  currentPath: string;
  showApiary?: boolean;
  showUser?: boolean;
  search?: string;
  typeFilter?: string;
  colonyFilter?: string;
  types: string[];
  colonies: string[];
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [colonyFilter, setColonyFilter] = useState('');

  const filteredHives = hives.filter(hive => {
    const matchesSearch =
      hive.name.toLowerCase().includes(search.toLowerCase()) ||
      hive.apiary?.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || hive.type === typeFilter;
    const matchesColony = !colonyFilter || hive.colonyType === colonyFilter;

    return matchesSearch && matchesType && matchesColony;
  });

  return (
    <>
      <div className="section-header">
        <Link href="/admin" className="back-link">
          ←
        </Link>
        <div className="filters">
          <input
            type="text"
            placeholder="Zoek op naam..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form__input"
          />

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="form__select"
          >
            <option value="">Alle behuizing</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={colonyFilter}
            onChange={e => setColonyFilter(e.target.value)}
            className="form__select"
          >
            <option value="">Alle variëteiten</option>
            {colonies.map(colony => (
              <option key={colony} value={colony}>
                {colony}
              </option>
            ))}
          </select>
        </div>
      </div>

      <HivesTable
        hives={filteredHives as any}
        showApiary={showApiary}
        showUser={showUser}
        currentPath={currentPath}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}
