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
        {/* <div className="filters">
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
        </div> */}
        <div className="filters">
          <SearchInput
            value={search}
            onChange={(value: string) => {
              setSearch(value);
              debouncedSearchUpdate(value);
            }}
            placeholder={placeholder}
          />
          <div
            style={{
              border: '1px solid var(--c-border)',
              borderRadius: '4px',
              padding: 'var(--s-5)',
              backgroundColor: 'var(--c-white)',
            }}
          >
            <label
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--c-text-muted)',
                marginBottom: 'var(--s-2)',
                display: 'block',
              }}
            >
              Zoek op stuifmeelkleur
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* 'Alle kleuren' knop */}
              <button
                type="button"
                onClick={() => handleColorChange('')}
                style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: colorFilter === '' ? '#e3f2fd' : 'white',
                  cursor: 'pointer',
                }}
                aria-label="Alle kleuren"
              >
                <span>Alle</span>
              </button>

              {allColors.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleColorChange(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    border:
                      colorFilter === option.value
                        ? '2px solid #1976d2'
                        : '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                  }}
                  aria-pressed={colorFilter === option.value}
                  aria-label={option.label}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: option.hex,
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      flexShrink: 0,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
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
