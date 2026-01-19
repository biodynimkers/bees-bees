import prisma from '@/lib/client';
import ApiariesTable from '@/components/admin/ApiariesTable';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
export default async function AdminUserApiariesPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin(); // Zorgt ervoor dat alleen admins toegang hebben

  const { userId } = await params;
  const searchParamsResult = await searchParams;
  const apiariesPerPage = 20;
  const currentPage = Number(searchParamsResult?.page ?? '1');
  const totalApiaries = await prisma.apiary.count();
  const totalPages = Math.ceil(totalApiaries / apiariesPerPage);
  const apiaries = await prisma.apiary.findMany({
    where: { userId },
    skip: (currentPage - 1) * apiariesPerPage,
    take: apiariesPerPage,
    include: { user: true, _count: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              Totaal: {apiaries.length} {apiaries.length === 1 ? 'bijenstand' : 'bijenstanden'}
            </span>
            <h1 className="platform-hero__title">Bijenstanden van {user?.name}</h1>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Gebruikers', href: '/admin/users' }, { label: user?.name || '', href: `/admin/users/${userId}` }, { label: 'Bijenstanden' }]} />

      <section className="home-features">
        <div className="container">
          <ApiariesTable
            apiaries={apiaries}
            showUser={false}
            currentPath={`/admin/users/${userId}/apiaries`}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </div>
  );
}
