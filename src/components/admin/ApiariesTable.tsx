import { Apiary, User } from '@prisma/client';
import Link from 'next/link';
// components/admin/ApiariesTable.tsx
interface ApiariesTableProps {
  apiaries: Array<Apiary & { user: User; _count: { hives: number } }>;
  showUser?: boolean; // Toon user kolom (voor globale lijst)
  currentPath: string;
  currentPage: number;
  totalPages: number;
}

export default function ApiariesTable({
  apiaries,
  showUser = true,
  currentPath,
  currentPage,
  totalPages,
}: ApiariesTableProps) {
  return (
    <>
      <table className="table" style={{ marginTop: '6rem' }}>
        <thead>
          <tr>
            <th>Naam</th>
            <th>Locatie</th>
            {showUser && <th>Eigenaar</th>}
            <th>Aantal kasten</th>
            <th>Aangemaakt</th>
          </tr>
        </thead>
        <tbody>
          {apiaries.map(apiary => (
            <tr key={apiary.id}>
              <td>
                <Link
                  href={`/admin/apiaries/${
                    apiary.id
                  }?returnUrl=${encodeURIComponent(currentPath)}`}
                >
                  {apiary.name}
                </Link>
              </td>
              <td>
                {apiary.latitude}, {apiary.longitude}
              </td>
              {showUser && <td>{apiary.user.name}</td>}
              <td>{apiary._count.hives}</td>
              <td>{new Date(apiary.createdAt).toLocaleDateString('nl-BE')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-12)',
          }}
        >
          <Link
            href={`${currentPath}?page=${
              currentPage > 1 ? currentPage - 1 : 1
            }`}
          >
            <button className="btn btn--secondary" disabled={currentPage === 1}>
              Vorige
            </button>
          </Link>
          <span style={{ color: 'var(--color-text-light)' }}>
            Pagina {currentPage} van {totalPages}
          </span>
          <Link
            href={`${currentPath}?page=${
              currentPage < totalPages ? currentPage + 1 : totalPages
            }`}
          >
            <button
              className="btn btn--secondary"
              disabled={currentPage === totalPages}
            >
              Volgende
            </button>
          </Link>
        </div>
      )}
    </>
  );
}
