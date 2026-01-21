import prisma from '@/lib/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatBeeCount } from '@/lib/utils/formatBeeCount';
import { formatPollenAmount } from '@/lib/utils/formatPollenAmount';
import {
  formatWeatherCondition,
  formatTemperature,
} from '@/lib/utils/formatWeather';
import PollenColorLegend from '@/components/shared/PollenColorLegend';
import { pollenColors } from '@/lib/pollenColors';
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
        include: { apiary: true },
      },
    },
  });
  if (!observation) {
    notFound();
  }
  if (observation.hive.apiary.userId !== session?.user.id) {
    redirect('/unauthorized');
  }

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              {observation.hive.name} • {observation.hive.apiary.name}
            </span>
            <h1 className="platform-hero__title">
              Waarneming {new Date(observation.createdAt).toLocaleDateString('nl-BE')}
            </h1>
            <div className="btn-group">
              <Link href={`/observations/${observationId}/edit`} className="btn btn--secondary">
                Bewerk
              </Link>
              {observation && (
                <DeleteEntityButton
                  id={observation.id}
                  type="observation"
                  label="Verwijder"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Waarnemingen', href: '/observations' },
          { label: 'Details' },
        ]}
      />

      <section className="home-features">
        <div className="container">
          <PollenColorLegend style={{ marginBottom: 'var(--s-12)' }} />
          
          <div className="home-features__grid">
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
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {observation.pollenColor.split(', ').map((color, index) => {
                      const colorData = pollenColors.find(c => c.hex === color);
                      const plantNames = colorData?.species.join(', ') || 'Onbekend';
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
                <div className="meta-item">
                  <span className="meta-label">Hoeveelheid stuifmeel</span>
                  <span className="meta-value">{formatPollenAmount(observation.pollenAmount)}</span>
                </div>
              </div>
            </div>

            {/* Weer */}
            <div className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Weersomstandigheden</span>
                  <span className="meta-value">{formatWeatherCondition(observation.weatherCondition)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Temperatuur</span>
                  <span className="meta-value">{formatTemperature(observation.temperature)}</span>
                </div>
              </div>
            </div>

            {/* Behuizing informatie */}
            <div className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Behuizing</span>
                  <Link href={`/hives/${observation.hive.id}`} className="meta-value" style={{ textDecoration: 'underline' }}>
                    {observation.hive.name}
                  </Link>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Bijenstand</span>
                  <Link href={`/apiaries/${observation.hive.apiary.id}`} className="meta-value" style={{ textDecoration: 'underline' }}>
                    {observation.hive.apiary.name}
                  </Link>
                </div>
              </div>
            </div>

            {/* Notities */}
            {observation.notes && (
              <div className="feature-card" style={{ gridColumn: '1 / -1' }}>
                <div className="feature-card__meta">
                  <div className="meta-item">
                    <span className="meta-label">Notities</span>
                    <p className="meta-value" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
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
