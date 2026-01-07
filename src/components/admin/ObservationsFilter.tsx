'use client';

import { useState } from 'react';
import Link from 'next/link';
import ObservationsTable from './ObservationsTable';

interface Observation {
  id: number;
  beeCount: number;
  pollenColor: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  hiveId: number;
  hive?: {
    id: number;
    name: string;
    apiary?: {
      id: number;
      name: string;
      userId: string;
      user?: { id: string; name: string };
    };
  };
}

export default function ObservationsFilter({
  observations,
  currentPage,
  totalPages,
  currentPath,
  showHive = true,
  showApiary = true,
  showUser = true,
}: {
  observations: Observation[];
  currentPage: number;
  totalPages: number;
  currentPath: string;
  showHive?: boolean;
  showApiary?: boolean;
  showUser?: boolean;
}) {
  const [search, setSearch] = useState('');
  const [colorFilter, setColorFilter] = useState('');

  const filteredObservations = observations.filter(obs => {
    const matchesSearch = 
      obs.notes?.toLowerCase().includes(search.toLowerCase()) ||
      obs.hive?.name.toLowerCase().includes(search.toLowerCase());
    const matchesColor = !colorFilter || obs.pollenColor === colorFilter;
    
    return matchesSearch && matchesColor;
  });

  const colors = [...new Set(observations.map(o => o.pollenColor))];

  return (
    <>
      <div className="section-header">
        <Link href="/admin" className="back-link">
          ←
        </Link>
        <div className="filters">
          <input
            type="text"
            placeholder="Zoek op notities of kast..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form__input"
          />
          
          <select
            value={colorFilter}
            onChange={e => setColorFilter(e.target.value)}
            className="form__select"
          >
            <option value="">Alle kleuren</option>
            {colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
      </div>

      <ObservationsTable
        observations={filteredObservations as any}
        showHive={showHive}
        showApiary={showApiary}
        showUser={showUser}
        currentPage={currentPage}
        totalPages={totalPages}
        currentPath={currentPath}
      />
    </>
  );
}
