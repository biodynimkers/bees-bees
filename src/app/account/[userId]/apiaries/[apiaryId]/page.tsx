import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { hasAccess } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function AccountApiaryPage({
  params,
}: {
  params: Promise<{ userId: string; apiaryId: string }>;
}) {
  const { userId, apiaryId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  // Check if user has access to this account
  if (!hasAccess(session, userId)) {
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

  if (!apiary) {
    redirect(`/account/${userId}`);
  }

  // Extra check: verify apiary belongs to this user
  if (apiary.userId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <section className="section section--standard bg-alt">
      <div className="container">
        <div className="apiary-detail-header">
          <div>
            <h1 className="title">{apiary.name}</h1>
            <p className="text-secondary">{apiary.location}</p>
          </div>
          <Link
            href={`/account/${userId}/apiaries/${apiary.id}/hives/new`}
            className="button button--primary"
          >
            + Nieuwe kast
          </Link>
        </div>

        {apiary.hives.length > 0 ? (
          <div className="hives-grid">
            {apiary.hives.map(hive => (
              <div key={hive.id} className="card">
                <h3 className="card__title">
                  {hive.type} - {hive.colonyType}
                </h3>
                <p className="text-secondary mb-md">
                  {hive.observations.length} observaties
                </p>
                <Link
                  href={`/account/${userId}/apiaries/${apiary.id}/hives/${hive.id}`}
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
              href={`/account/${userId}/apiaries/${apiary.id}/hives/new`}
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
