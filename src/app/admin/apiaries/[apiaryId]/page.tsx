import prisma from '@/lib/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-helpers';
import HivesTable from '@/components/admin/HivesTable';
export default async function ApiaryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ apiaryId: string }>;
  searchParams: Promise<{ returnUrl?: string; page?: string }>;
}) {
  const { apiaryId } = await params;
  const { page } = await searchParams;

  await requireAdmin();
  const { returnUrl } = (await searchParams) || '/admin/apiaries';
  const hivesPerPage = 5;
  const currentPage = Number(page ?? '1');
  const totalHives = await prisma.hive.count({
    where: { apiaryId: parseInt(apiaryId) },
  });
  const totalPages = Math.ceil(totalHives / hivesPerPage);

  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    include: {
      user: { select: { id: true, name: true, email: true } },
      hives: {
        skip: (currentPage - 1) * hivesPerPage,
        take: hivesPerPage,
        include: {
          _count: { select: { observations: true } },
        },
      },
    },
  });

  if (!apiary) notFound();

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="heading-primary">{apiary.name}</h1>
          <p className="page-header__subtitle">
            Eigenaar: <Link href={`/admin/users/${apiary.user.id}`}>{apiary.user.name}</Link>
          </p>
          <p className="page-header__subtitle">
            Locatie: {apiary.latitude}, {apiary.longitude}
          </p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">Behuizingen in deze bijenstand</h2>
            <Link href={returnUrl ?? '/admin/apiaries'}>
              <button className="btn btn--secondary">← Terug</button>
            </Link>
          </div>
          
          <HivesTable
            hives={apiary.hives}
            showApiary={false}
            currentPath={`/admin/apiaries/${apiaryId}`}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}
