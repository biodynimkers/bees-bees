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
  searchParams,
}: {
  params: Promise<{ observationId: string }>;
  searchParams?: Promise<{ returnUrl?: string }>;
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
  const searchParamsResult = await searchParams;
  const returnUrl = searchParamsResult?.returnUrl ?? '';
  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              {observation.hive.name} • {observation.hive.apiary.name}
            </span>
            <h1 className="platform-hero__title">
              Waarneming{' '}
              {new Date(observation.createdAt).toLocaleDateString('nl-BE')}
            </h1>
            <div className="btn-group">
              <Link
                href={`/observations/${observationId}/edit?returnUrl=${encodeURIComponent(returnUrl)}`}
                className="btn btn--secondary"
              >
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
          returnUrl && returnUrl.includes(`hives`)
            ? { label: 'Behuizing', href: returnUrl }
            : { label: 'Waarnemingen', href: '/observations' },
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
                  <span className="meta-value meta-value--small">
                    {new Date(observation.createdAt).toLocaleDateString(
                      'nl-BE',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      },
                    )}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tijd</span>
                  <span className="meta-value meta-value--small">
                    {new Date(observation.createdAt).toLocaleTimeString(
                      'nl-BE',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Aantal bijen */}
            <div className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Aantal bijen (geschat)</span>
                  <span className="meta-value meta-value--small">
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
                  <div className="observation-detail__pollen-container">
                    {observation.pollenColor.split(', ').map((color, index) => {
                      const colorData = pollenColors.find(c => c.hex === color);
                      console.log('colorData', colorData?.hex);
                      const plantNames =
                        colorData?.species.join(', ') || 'Onbekend';
                      return colorData ? (
                        <div
                          key={index}
                          className="pollen-color-dot"
                          style={{
                            backgroundColor: colorData?.hex,
                          }}
                          title={`Mogelijke planten: ${plantNames}`}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Hoeveelheid stuifmeel</span>
                  <span className="meta-value meta-value--small">
                    {formatPollenAmount(observation.pollenAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Weer */}
            <div className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Weersomstandigheden</span>
                  <span className="meta-value meta-value--small">
                    {formatWeatherCondition(observation.weatherCondition)}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Temperatuur</span>
                  <span className="meta-value meta-value--small">
                    {formatTemperature(observation.temperature)}
                  </span>
                </div>
              </div>
            </div>

            {/* Behuizing informatie */}
            <div className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Behuizing</span>
                  <Link
                    href={`/hives/${observation.hive.id}`}
                    className="meta-value meta-value--small"
                  >
                    {observation.hive.name}
                  </Link>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Bijenstand</span>
                  <Link
                    href={`/apiaries/${observation.hive.apiary.id}`}
                    className="meta-value meta-value--small"
                  >
                    {observation.hive.apiary.name}
                  </Link>
                </div>
              </div>
            </div>

            {/* Notities */}
            {observation.notes && (
              <div className="feature-card observation-detail__notes">
                <div className="feature-card__meta">
                  <div className="meta-item">
                    <span className="meta-label">Notities</span>
                    <p className="meta-value meta-value--small observation-detail__notes-text">
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
