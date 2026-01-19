import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import UsersPageClient from '@/components/admin/UsersPageClient';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const dynamic = 'force-dynamic';
type SearchParams = {
  page?: string;
  search?: string;
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);

  if (
    !session?.user?.id ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')
  ) {
    redirect('/unauthorized');
  }
  const searchParamsResult = (await searchParams) || {};
  const { page = '1', search = '' } = searchParamsResult;
  const currentPage = Number(searchParamsResult?.page ?? '1');
  const usersPerPage = 20;
  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const users = await prisma.user.findMany({
    skip: (currentPage - 1) * usersPerPage,
    take: usersPerPage,
    where: {
      OR: [
        {
          name: { contains: search, mode: 'insensitive' },
        },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    },
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
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              Totaal: {totalUsers} {totalUsers === 1 ? 'gebruiker' : 'gebruikers'}
            </span>
            <h1 className="platform-hero__title">Alle gebruikers</h1>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Gebruikers' }]} />

      <UsersPageClient
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        search={search}
      />
    </div>
  );
}
