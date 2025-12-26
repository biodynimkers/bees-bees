import { Hive, Apiary, User } from '@prisma/client';
import Link from 'next/link';

interface HivesTableProps {
  hives: Array<
    Hive & {
      apiary: Apiary & { user: User };
      _count: { observations: number };
    }
  >;
  showApiary?: boolean; // Toon bijenstand kolom
  showUser?: boolean; // Toon eigenaar kolom
}

export default function HivesTable({
  hives,
  showApiary = true,
  showUser = true,
}: HivesTableProps) {
  return (
    <table className="table" style={{ marginTop: '2rem' }}>
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
            <td>
              <Link href={`/admin/hives/${hive.id}`}>{hive.name}</Link>
            </td>
            <td>{hive.type}</td>
            <td>{hive.colonyType}</td>
            {showApiary && (
              <td>
                <Link href={`/admin/apiaries/${hive.apiary.id}`}>
                  {hive.apiary.name}
                </Link>
              </td>
            )}
            {showUser && (
              <td>
                <Link href={`/admin/users/${hive.apiary.userId}`}>
                  {hive.apiary.user.name}
                </Link>
              </td>
            )}
            <td>{hive._count.observations}</td>
            <td>{new Date(hive.createdAt).toLocaleDateString('nl-BE')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
