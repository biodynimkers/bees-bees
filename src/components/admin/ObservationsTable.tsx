import { Observation, Hive, Apiary, User } from '@prisma/client';
import Link from 'next/link';

interface ObservationsTableProps {
  observations: Array<
    Observation & {
      hive: Hive & {
        apiary: Apiary & { user: User };
      };
    }
  >;
  showHive?: boolean;
  showApiary?: boolean;
  showUser?: boolean;
}

export default function ObservationsTable({
  observations,
  showHive = true,
  showApiary = true,
  showUser = true,
}: ObservationsTableProps) {
  return (
    <table className="table" style={{ marginTop: '6rem' }}>
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
            <td>{observation.beeCount}</td>
            <td>{observation.pollenColor}</td>
            <td>{observation.notes || '-'}</td>
            {showHive && (
              <td>
                <Link href={`/admin/hives/${observation.hive.id}`}>
                  {observation.hive.name}
                </Link>
              </td>
            )}
            {showApiary && (
              <td>
                <Link href={`/admin/apiaries/${observation.hive.apiary.id}`}>
                  {observation.hive.apiary.name}
                </Link>
              </td>
            )}
            {showUser && (
              <td>
                <Link href={`/admin/users/${observation.hive.apiary.userId}`}>
                  {observation.hive.apiary.user.name}
                </Link>
              </td>
            )}
            <td>
              {new Date(observation.createdAt).toLocaleDateString('nl-BE')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
