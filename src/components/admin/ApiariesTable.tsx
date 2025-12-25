import { Apiary, User } from '@prisma/client';
import Link from 'next/link';
// components/admin/ApiariesTable.tsx
interface ApiariesTableProps {
  apiaries: Array<Apiary & { user: User; _count: { hives: number } }>;
  showUser?: boolean; // Toon user kolom (voor globale lijst)
}

export default function ApiariesTable({
  apiaries,
  showUser = true,
}: ApiariesTableProps) {
  return (
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
              <Link href={`/admin/apiaries/${apiary.id}`}>{apiary.name}</Link>
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
  );
}
