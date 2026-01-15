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
    <>
      <section className="page-header" data-page="03">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 'var(--space-6)',
            }}
          >
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h1 className="heading-primary">Waarneming</h1>
              <p className="page-header__subtitle">
                {observation.hive.name} • {observation.hive.apiary.name} •{' '}
                {new Date(observation.createdAt).toLocaleDateString('nl-BE')}
              </p>
              <a className="back-link" href="/observations">
                ←
              </a>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-3)',
                flexWrap: 'wrap',
              }}
            >
              <Link href={`/observations/${observationId}/edit`}>
                <button className="btn btn--secondary">
                  Wijzig waarneming
                </button>
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

      <section className="section ">
        <div className="container container--narrow">
          <PollenColorLegend style={{ marginBottom: 'var(--space-8)' }} />
          <div
            className="grid grid-two-columns"
            style={{ gap: 'var(--space-12)' }}
          >
            {/* Observatie Details Card */}
            <div
              className="card"
              style={{ height: 'fit-content', padding: 'var(--space-10)' }}
            >
              <h2
                className="heading-secondary"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  marginBottom: 'var(--space-10)',
                  paddingBottom: 'var(--space-5)',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                Observatie gegevens
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-10)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-5)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      background: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '52px',
                      minHeight: '52px',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: '600',
                      }}
                    >
                      Datum en tijd
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.125rem',
                        lineHeight: '1.5',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      {new Date(observation.createdAt).toLocaleDateString(
                        'nl-BE',
                        {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--color-text-light)',
                      }}
                    >
                      {new Date(observation.createdAt).toLocaleTimeString(
                        'nl-BE',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-5)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      background: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '52px',
                      minHeight: '52px',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11c0-5.5-4.5-10-10-10S1 5.5 1 11c0 3.5 2 6.5 5 8v4c0 .6.4 1 1 1h10c.6 0 1-.4 1-1v-4c3-1.5 5-4.5 5-8z"></path>
                      <path d="M11 17c-1.7 0-3-1.3-3-3"></path>
                      <path d="M16 6l-5 5-2-2"></path>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: '600',
                      }}
                    >
                      Aantal bijen (geschat)
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2.5rem',
                        fontWeight: '300',
                        lineHeight: '1',
                      }}
                    >
                      {formatBeeCount(observation.beeCount)}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-5)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      background: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '52px',
                      minHeight: '52px',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="4"></circle>
                      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                      <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
                      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: '600',
                      }}
                    >
                      Stuifmeelkleur
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: 'var(--space-3)',
                        alignItems: 'center',
                        flexWrap: 'wrap',
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

                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-5)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      background: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '52px',
                      minHeight: '52px',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M8 5l4-3 4 3M8 19l4 3 4-3"></path>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: '600',
                      }}
                    >
                      Hoeveelheid stuifmeel
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                      }}
                    >
                      {formatPollenAmount(observation.pollenAmount)}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-5)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      background: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '52px',
                      minHeight: '52px',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20"></path>
                      <path d="M17 7l-5-3-5 3"></path>
                      <path d="M17 17l-5 3-5-3"></path>
                      <circle cx="12" cy="8" r="3"></circle>
                      <circle cx="12" cy="16" r="3"></circle>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: '600',
                      }}
                    >
                      Weersomstandigheden
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                      }}
                    >
                      {formatWeatherCondition(observation.weatherCondition)}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-5)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      background: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '52px',
                      minHeight: '52px',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 4v10l-2 1L10 14V4a2 2 0 0 1 4 0Z"></path>
                      <path d="M10 7h4"></path>
                      <path d="M10 20a2 2 0 1 0 4 0v-2a2 2 0 0 0-4 0v2Z"></path>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: '600',
                      }}
                    >
                      Temperatuur
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                      }}
                    >
                      {formatTemperature(observation.temperature)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kast Info & Notities Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-10)',
              }}
            >
              {/* Kast informatie */}
              <div className="card" style={{ padding: 'var(--space-10)' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: '400',
                    marginBottom: 'var(--space-8)',
                    paddingBottom: 'var(--space-4)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  }}
                >
                  Kast informatie
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-6)',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: '600',
                      }}
                    >
                      Kast
                    </p>
                    <Link
                      href={`/hives/${observation.hive.id}`}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.125rem',
                        color: 'var(--color-text)',
                        textDecoration: 'underline',
                        textDecorationColor: 'rgba(0, 0, 0, 0.2)',
                        textUnderlineOffset: '4px',
                        transition: 'text-decoration-color 0.3s',
                      }}
                    >
                      {observation.hive.name}
                    </Link>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: '600',
                      }}
                    >
                      Bijenstand
                    </p>
                    <Link
                      href={`/apiaries/${observation.hive.apiary.id}`}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.125rem',
                        color: 'var(--color-text)',
                        textDecoration: 'underline',
                        textDecorationColor: 'rgba(0, 0, 0, 0.2)',
                        textUnderlineOffset: '4px',
                        transition: 'text-decoration-color 0.3s',
                      }}
                    >
                      {observation.hive.apiary.name}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Notities */}
              {observation.notes && (
                <div className="card" style={{ padding: 'var(--space-10)' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--space-3)',
                      marginBottom: 'var(--space-6)',
                      paddingBottom: 'var(--space-4)',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: '400',
                      }}
                    >
                      Notities
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      lineHeight: '1.8',
                      color: 'var(--color-text)',
                    }}
                  >
                    {observation.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
