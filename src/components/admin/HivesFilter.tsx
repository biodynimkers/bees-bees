'use client';

import { use, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import HivesTable from './HivesTable';
import { useDebouncedCallback } from 'use-debounce';

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [colonyFilter, setColonyFilter] = useState(initialColony);

  //functie meer generiek gemaakt zodat die voor meerdere filters gebruikt kan worden

  const debouncedUpdateUrl = useDebouncedCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('page');
      router.push(`${currentPath}?${params.toString()}`);
    },
    300,
  );

  return (
    <>
      <div className="section-header">
        <div className="filters">
          <input
            type="text"
            placeholder="Zoek op naam of bijenstand..."
            value={search}
            onChange={e => {
              const value = e.target.value;
              setSearch(value);
              debouncedUpdateUrl('search', value);
            }}
            className="form__input"
          />

          <select
            value={typeFilter}
            onChange={e => {
              const value = e.target.value;
              setTypeFilter(value);
              debouncedUpdateUrl('type', value);
            }}
            className="form__select"
          >
            <option value="">Alle behuizingen</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={colonyFilter}
            onChange={e => {
              const value = e.target.value;
              setColonyFilter(value);
              debouncedUpdateUrl('colony', value);
            }}
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
        hives={hives as any}
        showApiary={showApiary}
        showUser={showUser}
        currentPath={currentPath}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}
