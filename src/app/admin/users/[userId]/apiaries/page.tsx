import prisma from '@/lib/client';
import ApiariesTable from '@/components/admin/ApiariesTable';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';
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
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="heading-primary">Bijenstanden van {user?.name}</h1>
          <p className="page-header__subtitle">
            Totaal: {apiaries.length}{' '}
            {apiaries.length === 1 ? 'bijenstand' : 'bijenstanden'}
          </p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <Link href={`/admin/users/${userId}`}>
              <button className="btn btn--secondary">← Terug naar imker</button>
            </Link>
          </div>

          <ApiariesTable
            apiaries={apiaries}
            showUser={false}
            currentPath={`/admin/users/${userId}/apiaries`}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}
