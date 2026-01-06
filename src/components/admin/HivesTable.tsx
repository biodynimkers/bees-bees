import { Hive, Apiary, User } from '@prisma/client';
import Link from 'next/link';

interface HivesTableProps {
  hives: Array<
    Hive & {
      apiary?: Apiary & { user: User };
      _count: { observations: number };
    }
  >;
  currentPath: string;
  showApiary?: boolean; // Toon bijenstand kolom
  showUser?: boolean; // Toon eigenaar kolom
  currentPage: number;
  totalPages: number;
}

export default function HivesTable({
  hives,
  showApiary = true,
  showUser = true,
  currentPath,
  currentPage,
  totalPages,
}: HivesTableProps) {
  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Type</th>
              <th>Volk</th>
              {showApiary && <th>Bijenstand</th>}
              {showUser && <th>Eigenaar</th>}
              <th>Waarnemingen</th>
              <th>Aangemaakt</th>
            </tr>
          </thead>
          <tbody>
            {hives.map(hive => (
              <tr key={hive.id}>
                <td data-label="Naam">
                  <Link
                    href={`/admin/hives/${hive.id}?returnUrl=${encodeURIComponent(
                      currentPath
                    )}`}
                  >
                    {hive.name}
                  </Link>
                </td>
                <td data-label="Type">{hive.type}</td>
                <td data-label="Volk">{hive.colonyType}</td>
                {showApiary && (
                  <td data-label="Bijenstand">
                    <Link href={`/admin/apiaries/${hive.apiary?.id}`}>
                      {hive.apiary?.name}
                    </Link>
                  </td>
                )}
                {showUser && (
                  <td data-label="Eigenaar">
                    <Link href={`/admin/users/${hive.apiary?.userId}`}>
                      {hive.apiary?.user.name}
                    </Link>
                  </td>
                )}
                <td data-label="Waarnemingen">{hive._count.observations}</td>
                <td data-label="Aangemaakt">{new Date(hive.createdAt).toLocaleDateString('nl-BE')}</td>
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
