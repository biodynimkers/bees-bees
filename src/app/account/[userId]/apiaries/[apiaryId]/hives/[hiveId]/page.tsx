import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export default async function AccountApiaryHivePage({
  params,
}: {
  params: Promise<{ userId: string; apiaryId: string; hiveId: string }>;
}) {
  const { userId, apiaryId, hiveId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },
    include: {
      apiary: true,
      observations: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!hive) redirect('/account');

  return (
    <section className="section section--standard bg-alt">
      <div className="container">
        <div className="hive-header">
          <div>
            <Link
              href={`/account/${userId}/apiaries/${apiaryId}`}
              className="breadcrumb"
            >
              ← {hive.apiary.name}
            </Link>
            <h1 className="title">
              {hive.type} - {hive.colonyType}
            </h1>
            <p className="text-secondary">{hive.apiary.location}</p>
          </div>
          <Link
            href={`/account/${userId}/apiaries/${apiaryId}/hives/${hive.id}/observations/new`}
            className="button button--primary"
          >
            + Nieuwe observatie
          </Link>
        </div>

        <div className="hive-content">
          <div className="map-container">
            <div className="map-placeholder">
              <p className="text-secondary">
                Google Maps met 2km en 7km cirkel rond {hive.apiary.location}
              </p>
            </div>
            <p className="map-hint">
              <strong>Drachtgebied:</strong> De cirkels tonen het bereik waarin
              bijen voedsel zoeken (2-7km)
            </p>
          </div>

          <div className="observations-section">
            <h2 className="section__title section__title--left">
              Recente observaties
            </h2>
            {hive.observations.length > 0 ? (
              <div className="observations-list">
                {hive.observations.map(obs => (
                  <div key={obs.id} className="observation-card">
                    <div className="observation-card__header">
                      <span className="observation-card__date">
                        {new Date(obs.createdAt).toLocaleDateString('nl-BE')}
                      </span>
                      <span className="badge">{obs.beeCount} bijen</span>
                    </div>
                    <p className="text-secondary">
                      Stuifmeelkleur: {obs.pollenColor}
                    </p>
                    {obs.notes && (
                      <p className="observation-card__notes">{obs.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary">Nog geen observaties</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
