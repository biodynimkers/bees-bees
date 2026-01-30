import { Observation, Hive, Apiary, User } from '@prisma/client';
import Link from 'next/link';
import { formatBeeCount } from '@/lib/utils/formatBeeCount';
import { formatPollenAmount } from '@/lib/utils/formatPollenAmount';
import {
  formatWeatherCondition,
  formatTemperature,
} from '@/lib/utils/formatWeather';

import { pollenColors } from '@/lib/pollenColors';

const getWeatherEmoji = (
  weatherCondition: string | null | undefined,
): string => {
  switch (weatherCondition) {
    case 'SUNNY':
      return '☀️';
    case 'PARTLY_CLOUDY':
      return '⛅';
    case 'CLOUDY':
      return '☁️';
    case 'RAINY':
      return '🌧️';
    default:
      return '-';
  }
};

const truncateNotes = (notes: string | null): string => {
  if (!notes) return '-';
  const words = notes.trim().split(/\s+/);
  if (words.length <= 2) return notes;
  return words.slice(0, 2).join(' ') + '...';
};

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
  basePath?: string;
  currentPath?: string;
  currentPage: number;
  totalPages: number;
}

export default function ObservationsTable({
  observations,
  showHive = true,
  showApiary = true,
  showUser = true,
  basePath = '',
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
              <th>Datum</th>
              <th>Aantal bijen</th>
              <th>Stuifmeel kleur</th>
              <th>Stuifmeel hoeveelheid</th>
              <th>Weer</th>
              <th>Temperatuur</th>
              <th>Notities</th>
              <th>Locatie</th>
              {showHive && <th>Behuizing</th>}
              {showApiary && <th>Bijenstand</th>}
              {showUser && <th>Eigenaar</th>}
            </tr>
          </thead>
          <tbody>
            {observations.map(observation => (
              <tr key={observation.id}>
                <td data-label="Datum">
                  <Link
                    href={`${basePath}/observations/${observation.id}?returnUrl=${encodeURIComponent(currentPath || '')}`}
                  >
                    {new Date(observation.createdAt).toLocaleDateString(
                      'nl-BE',
                    )}
                  </Link>
                </td>
                <td data-label="Aantal bijen">
                  {formatBeeCount(observation.beeCount)}
                </td>
                <td data-label="Stuifmeel kleur">
                  <div className="table__pollen-colors">
                    {observation.pollenColor.split(', ').map((color, index) => {
                      const colorData = pollenColors.find(c => c.hex === color);
                      const plantNames =
                        colorData?.species.join(', ') || 'Onbekend';
                      return (
                        <div
                          key={index}
                          className="table__pollen-dot"
                          style={{ backgroundColor: color }}
                          title={`Mogelijke planten: ${plantNames}`}
                        />
                      );
                    })}
                  </div>
                </td>
                <td data-label="Stuifmeel hoeveelheid">
                  {formatPollenAmount(observation.pollenAmount)}
                </td>
                <td data-label="Weer" className="table__weather">
                  {getWeatherEmoji(observation.weatherCondition)}
                </td>
                <td data-label="Temperatuur">
                  {formatTemperature(observation.temperature)}
                </td>
                <td data-label="Notities">
                  <Link
                    href={`${basePath}/observations/${observation.id}`}
                    className="table__notes-link"
                  >
                    {truncateNotes(observation.notes)}
                  </Link>
                </td>
                <td data-label="Locatie">
                  {observation.hive?.apiary?.latitude &&
                  observation.hive?.apiary?.longitude ? (
                    <a
                      href={`https://www.google.com/maps?q=${observation.hive.apiary.latitude},${observation.hive.apiary.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--secondary table__btn-small"
                    >
                      Kaart
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                {showHive && observation.hive && (
                  <td data-label="Behuizing">
                    <Link href={`${basePath}/hives/${observation.hive.id}`}>
                      {observation.hive.name}
                    </Link>
                  </td>
                )}
                {showApiary && observation.hive?.apiary && (
                  <td data-label="Bijenstand">
                    <Link
                      href={`${basePath}/apiaries/${observation.hive.apiary.id}`}
                    >
                      {observation.hive.apiary.name}
                    </Link>
                  </td>
                )}
                {showUser && observation.hive?.apiary?.user && (
                  <td data-label="Eigenaar">
                    <Link
                      href={`${basePath}/users/${observation.hive.apiary.userId}`}
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
