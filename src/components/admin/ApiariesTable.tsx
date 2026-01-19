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
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Locatie</th>
              {showUser && <th>Eigenaar</th>}
              <th>Aantal behuizingen</th>
              <th>Aangemaakt</th>
            </tr>
          </thead>
          <tbody>
            {apiaries.map(apiary => (
              <tr key={apiary.id}>
                <td data-label="Naam">
                  <Link
                    href={`/admin/apiaries/${
                      apiary.id
                    }?returnUrl=${encodeURIComponent(currentPath)}`}
                  >
                    {apiary.name}
                  </Link>
                </td>
                <td data-label="Locatie">
                  {apiary.latitude}, {apiary.longitude}
                </td>
                {showUser && <td data-label="Eigenaar">{apiary.user.name}</td>}
                <td data-label="Aantal behuizingen">{apiary._count.hives}</td>
                <td data-label="Aangemaakt">{new Date(apiary.createdAt).toLocaleDateString('nl-BE')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <Link
            href={`${currentPath}?page=${
              currentPage > 1 ? currentPage - 1 : 1
            }`}
          >
            <button className="btn btn--secondary" disabled={currentPage === 1}>
              Vorige
            </button>
          </Link>
          <span className="pagination__text">
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
