import prisma from '@/lib/client';
import Link from 'next/link';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      apiaries: true,
    },
  });

  return (
    <div>
      <h1>Alle gebruikers</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {' '}
            <Link href={`/admin/users/${user.id}`}>{user.name}</Link>(
            {user.email}) - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
