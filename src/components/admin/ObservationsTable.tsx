import { Observation, Hive, Apiary, User } from '@prisma/client';
import Link from 'next/link';

interface ObservationsTableProps {
  observations: Array<
    Observation & {
      hive?: Hive & {
        apiary?: Apiary & { user?: User };
      };
    }
  >;
  showHive?: boolean;
  showApiary?: boolean;
  showUser?: boolean;
  currentPath?: string;
  currentPage: number;
  totalPages: number;
}

export default function ObservationsTable({
  observations,
  showHive = true,
  showApiary = true,
  showUser = true,
  currentPath,
  currentPage,
  totalPages,
}: ObservationsTableProps) {
  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Aantal bijen</th>
              <th>Stuifmeel kleur</th>
              <th>Notities</th>
              {showHive && <th>Kast</th>}
              {showApiary && <th>Bijenstand</th>}
              {showUser && <th>Eigenaar</th>}
              <th>Aangemaakt</th>
            </tr>
          </thead>
          <tbody>
            {observations.map(observation => (
              <tr key={observation.id}>
                <td data-label="Aantal bijen">{observation.beeCount}</td>
                <td data-label="Stuifmeel kleur">
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    {observation.pollenColor.split(', ').map((color, index) => (
                      <div
                        key={index}
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: '1px solid rgba(0, 0, 0, 0.2)',
                          flexShrink: 0,
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </td>
                <td data-label="Notities">{observation.notes || '-'}</td>
                {showHive && observation.hive && (
                  <td data-label="Kast">
                    <Link href={`/admin/hives/${observation.hive.id}`}>
                      {observation.hive.name}
                    </Link>
                  </td>
                )}
                {showApiary && observation.hive?.apiary && (
                  <td data-label="Bijenstand">
                    <Link
                      href={`/admin/apiaries/${observation.hive.apiary.id}`}
                    >
                      {observation.hive.apiary.name}
                    </Link>
                  </td>
                )}
                {showUser && observation.hive?.apiary?.user && (
                  <td data-label="Eigenaar">
                    <Link
                      href={`/admin/users/${observation.hive.apiary.userId}`}
                    >
                      {observation.hive.apiary.user.name}
                    </Link>
                  </td>
                )}
                <td data-label="Aangemaakt">
                  {new Date(observation.createdAt).toLocaleDateString('nl-BE')}
                </td>
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
