'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
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
  basePath = '',
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
  basePath?: string;
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
    params.set('scrollTo', 'observations');
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
    params.set('scrollTo', 'observations');
    router.push(`${currentPath}?${params.toString()}`);
  };

  const colors = allColors;

  return (
    <>
      <div className="section-header">
        <div className="filters">
          <SearchInput
            value={search}
            onChange={(value: string) => {
              setSearch(value);
              debouncedSearchUpdate(value);
            }}
            placeholder={placeholder}
          />

          {allColors.length > 0 && (
            <div className="filter-group">
              <label className="filter-group__label">Stuifmeelkleur</label>
              <div className="filter-colors">
                <button
                  type="button"
                  onClick={() => handleColorChange('')}
                  className={`filter-color-btn ${colorFilter === '' ? 'filter-color-btn--active' : ''}`}
                  aria-label="Alle kleuren"
                >
                  Alle
                </button>

                {allColors.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleColorChange(option.value)}
                    className={`filter-color-swatch ${colorFilter === option.value ? 'filter-color-swatch--active' : ''}`}
                    aria-pressed={colorFilter === option.value}
                    aria-label={option.label}
                    title={option.label}
                  >
                    <div
                      className="filter-color-swatch__inner"
                      style={{ backgroundColor: option.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ObservationsTable
        observations={observations as any}
        showHive={showHive}
        showApiary={showApiary}
        showUser={showUser}
        basePath={basePath}
        currentPage={currentPage}
        totalPages={totalPages}
        currentPath={currentPath}
      />
    </>
  );
}
