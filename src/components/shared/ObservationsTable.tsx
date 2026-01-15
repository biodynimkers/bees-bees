import { Observation, Hive, Apiary, User } from '@prisma/client';
import Link from 'next/link';
import { formatBeeCount } from '@/lib/utils/formatBeeCount';

import { pollenColors } from '@/lib/pollenColors';

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
  const getObservationLink = (id: number) => {
    if (currentPath?.includes('/admin')) {
      return `/admin/observations/${id}`;
    }
    return `/observations/${id}`;
  };

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Aantal bijen</th>
              <th>Stuifmeel kleur</th>
              <th>Notities</th>
              {showHive && <th>Kast</th>}
              {showApiary && <th>Bijenstand</th>}
              {showUser && <th>Eigenaar</th>}
            </tr>
          </thead>
          <tbody>
            {observations.map(observation => (
              <tr key={observation.id}>
                <td data-label="Datum">
                  <Link href={getObservationLink(observation.id)}>
                    {new Date(observation.createdAt).toLocaleDateString(
                      'nl-BE'
                    )}
                  </Link>
                </td>
                <td data-label="Aantal bijen">{formatBeeCount(observation.beeCount)}</td>
                <td data-label="Stuifmeel kleur">
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    {observation.pollenColor.split(', ').map((color, index) => {
                      const colorData = pollenColors.find(c => c.hex === color);
                      const plantNames =
                        colorData?.species.join(', ') || 'Onbekend';
                      return (
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
                          title={`Mogelijke planten: ${plantNames}`}
                        />
                      );
                    })}
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
