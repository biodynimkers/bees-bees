'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ApiariesTable from './ApiariesTable';
import { useDebouncedCallback } from 'use-debounce';
import SearchInput from '@/components/shared/SearchInput';

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
  search: initialSearch = '',
}: {
  apiaries: Apiary[];
  currentPage: number;
  totalPages: number;
  currentPath: string;
  search?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

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
            placeholder={'Zoek op naam of eigenaar...'}
          />
        </div>
      </div>

      <ApiariesTable
        apiaries={apiaries as any}
        showUser={true}
        currentPath={currentPath}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}
