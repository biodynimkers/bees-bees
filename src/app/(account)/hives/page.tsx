import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export default async function AccountHivesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      apiaries: {
        include: {
          hives: true,
        },
      },
    },
  });

  if (!user) redirect('/auth/login');

  const allHives = user.apiaries.flatMap(apiary =>
    apiary.hives.map(hive => ({
      ...hive,
      apiaryName: apiary.name,
      apiaryId: apiary.id,
    }))
  );

  return (
    <section className="section section--standard bg-alt">
      <div className="container">
        <div className="page-header">
          <h1 className="title">Mijn kasten</h1>
        </div>

        {allHives.length > 0 ? (
          <div className="hives-list">
            {allHives.map(hive => (
              <Link
                key={hive.id}
                href={`/hives/${hive.id}`}
                className="hive-card hive-card--link"
              >
                <div className="hive-card__header">
                  <h3 className="card__title">{hive.type}</h3>
                  <span className="badge badge--secondary">
                    {hive.colonyType}
                  </span>
                </div>
                <p className="card__text text-secondary">
                  Bijenstand: {hive.apiaryName}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="section__title">Nog geen kasten</h2>
            <p className="text-secondary mb-lg">
              Voeg eerst een bijenstand toe om kasten te kunnen aanmaken
            </p>
            <Link
              href="/apiaries/new"
              className="button button--primary button--large"
            >
              + Bijenstand toevoegen
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
