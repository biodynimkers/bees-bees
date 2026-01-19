import prisma from '@/lib/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { formatBeeCount } from '@/lib/utils/formatBeeCount';
import PollenColorLegend from '@/components/shared/PollenColorLegend';
import { pollenColors } from '@/lib/pollenColors';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function Observation({
  params,
}: {
  params: Promise<{ observationId: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { observationId } = await params;

  const observation = await prisma.observation.findUnique({
    where: { id: parseInt(observationId) },
    include: {
      hive: {
        include: { 
          apiary: {
            include: { user: true },
          },
        },
      },
    },
  });
  if (!observation) {
    notFound();
  }
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'SUPERADMIN') {
    redirect('/unauthorized');
  }

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              <Link href={`/admin/users/${observation.hive.apiary.user.id}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                {observation.hive.apiary.user.name}
              </Link>
              {' • '}{observation.hive.name} • {observation.hive.apiary.name}
            </span>
            <h1 className="platform-hero__title">Waarneming</h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)', marginTop: '12px' }}>
              {new Date(observation.createdAt).toLocaleDateString('nl-BE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Waarnemingen', href: '/admin/observations' }, { label: 'Details' }]} />

      <section className="home-features">
        <div className="container">
          <PollenColorLegend style={{ marginBottom: 'var(--space-8)' }} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Datum en tijd */}
            <div className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Datum</span>
                  <span className="meta-value">
                    {new Date(observation.createdAt).toLocaleDateString('nl-BE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tijd</span>
                  <span className="meta-value">
                    {new Date(observation.createdAt).toLocaleTimeString('nl-BE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Aantal bijen */}
            <div className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Aantal bijen (geschat)</span>
                  <span className="meta-value" style={{ fontSize: '2rem', fontWeight: '300' }}>
                    {formatBeeCount(observation.beeCount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stuifmeel */}
            <div className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Stuifmeelkleur</span>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--space-3)',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginTop: '8px',
                    }}
                  >
                      {observation.pollenColor
                        .split(', ')
                        .map((color, index) => {
                          const colorData = pollenColors.find(
                            c => c.hex === color
                          );
                          const plantNames =
                            colorData?.species.join(', ') || 'Onbekend';
                          return (
                            <div
                              key={index}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: color,
                                border: '2px solid rgba(0, 0, 0, 0.1)',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              }}
                              title={`Mogelijke planten: ${plantNames}`}
                            />
                          );
                        })}
                  </div>
                </div>
              </div>
            </div>

            {/* Behuizing informatie */}
            <div className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Behuizing</span>
                  <span className="meta-value">{observation.hive.name}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Bijenstand</span>
                  <span className="meta-value">{observation.hive.apiary.name}</span>
                </div>
              </div>
            </div>

            {/* Notities */}
            {observation.notes && (
              <div className="feature-card" style={{ gridColumn: '1 / -1' }}>
                <div className="feature-card__meta">
                  <div className="meta-item">
                    <span className="meta-label">Notities</span>
                    <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', marginTop: '8px' }}>
                      {observation.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
