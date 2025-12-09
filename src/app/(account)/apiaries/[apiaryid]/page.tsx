import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export default async function AccountApiaryPage({
  params,
}: {
  params: Promise<{ apiaryId: string }>;
}) {
  const session = await getServerSession(authOptions);
  console.log('params received in AccountApiaryPage:', params);
  const { apiaryId } = await params;

  const apiaryOwner = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: { userId: true },
  });

  if (!apiaryOwner) {
    redirect('/not-found');
  }

  if (
    apiaryOwner.userId !== session?.user.id &&
    session?.user.role !== 'ADMIN'
  ) {
    redirect('/unauthorized');
  }

  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    include: {
      hives: {
        include: {
          observations: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      },
    },
  });

  return (
    <section className="section section--standard bg-alt">
      <div className="container">
        <div className="apiary-detail-header">
          <div>
            <h1 className="title">{apiary?.name}</h1>
            <p className="text-secondary">{apiary?.longitude}</p>
            <p className="text-secondary mb-md">{apiary?.latitude}</p>
          </div>
          <Link
            href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}
            className="button button--primary"
          >
            + Nieuwe kast
          </Link>
        </div>

        {apiary?.hives?.length ? (
          <div className="hives-grid">
            {apiary?.hives.map(hive => (
              <div key={hive.id} className="card">
                <h3 className="card__title">
                  {hive.type} - {hive.colonyType}
                </h3>
                <p className="text-secondary mb-md">
                  {hive.observations.length} observaties
                </p>
                <Link
                  href={`/hives/${hive.id}`}
                  className="button button--outline"
                >
                  Bekijk details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="section__title">Nog geen kasten</h2>
            <p className="text-secondary mb-lg">
              Voeg uw eerste bijenkast toe aan deze stand
            </p>
            <Link
              href={`/hives/new`}
              className="button button--primary button--large"
            >
              + Eerste kast toevoegen
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
