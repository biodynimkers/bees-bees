import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import UsersFilter from '@/components/admin/UsersFilter';

export const dynamic = 'force-dynamic';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }
  const page = await searchParams;
  const currentPage = Number(page?.page ?? '1');
  const usersPerPage = 5;
  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const users = await prisma.user.findMany({
    skip: (currentPage - 1) * usersPerPage,
    take: usersPerPage,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      _count: {
        select: {
          apiaries: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Alle gebruikers</h1>
          <p className="page-header__subtitle">
            Beheer gebruikersaccounts en bekijk activiteit
          </p>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <UsersFilter
            users={users}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </section>
    </>
  );
}
