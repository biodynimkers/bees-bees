import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export default async function AccountApiariesPage() {
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

  return (
    <section className="section section--standard bg-alt">
      <div className="container">
        <div className="page-header">
          <h1 className="title">Mijn bijenstanden</h1>
          <Link href={`/apiaries/new`} className="button button--primary">
            + Nieuwe bijenstand
          </Link>
        </div>

        {user.apiaries.length > 0 ? (
          <div className="apiaries-list">
            {user.apiaries.map(apiary => (
              <Link
                key={apiary.id}
                href={`/apiaries/${apiary.id}`}
                className="apiary-card apiary-card--link"
              >
                <div className="apiary-card__header">
                  <h3 className="card__title">{apiary.name}</h3>
                  <span className="badge">{apiary.hives.length} kasten</span>
                </div>
                <p className="card__text">
                  Locatie: {apiary.latitude?.toFixed(5)},{' '}
                  {apiary.longitude?.toFixed(5)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="section__title">Nog geen bijenstanden</h2>
            <p className="text-secondary mb-lg">
              Begin met het toevoegen van uw eerste bijenstand
            </p>
            <Link
              href="/apiaries/new"
              className="button button--primary button--large"
            >
              + Eerste bijenstand toevoegen
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
