'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import Link from 'next/link';
import ObservationsTable from '@/components/shared/ObservationsTable';
import SearchInput from '@/components/shared/SearchInput';

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
  search: initialSearch = '',
  colorFilter: initialColorFilter = '',
  allColors = [],
  placeholder = 'Zoek...',
}: {
  observations: Observation[];
  currentPage: number;
  totalPages: number;
  currentPath: string;
  showHive?: boolean;
  showApiary?: boolean;
  showUser?: boolean;
  search?: string;
  colorFilter?: string;
  allColors?: { value: string; label: string; hex: string }[];
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [colorFilter, setColorFilter] = useState(initialColorFilter);

  const debouncedSearchUpdate = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`${currentPath}?${params.toString()}`);
  }, 300);

  const handleColorChange = (value: string) => {
    setColorFilter(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('color', value);
    } else {
      params.delete('color');
    }
    params.delete('page'); // Reset to page 1 when filtering
    router.push(`${currentPath}?${params.toString()}`);
  };

  const colors = allColors; //

  return (
    <>
      <div className="section-header">
        {/* <Link href="/admin" className="back-link">
          ←
        </Link> */}
        <div className="filters">
          <SearchInput
            value={search}
            onChange={(value: string) => {
              setSearch(value);
              debouncedSearchUpdate(value);
            }}
            placeholder={placeholder}
          />
          <select
            value={colorFilter}
            onChange={e => handleColorChange(e.target.value)}
            className="form__select"
          >
            <option value="">Alle kleuren</option>
            {allColors.map(option => (
              <option
                key={option.value}
                value={option.value}
                style={{
                  backgroundColor: option.hex,
                  color: '#000',
                }}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ObservationsTable
        observations={observations as any}
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
