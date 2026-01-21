import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';
import DeleteUserButton from '@/components/admin/DeleteUserButton';
import EditUserButton from '@/components/admin/EditUserButton';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          apiaries: true,
        },
      },
    },
  });
  const totalHives = await prisma.hive.count({
    where: {
      apiary: {
        userId,
      },
    },
  });
  const totalObservations = await prisma.observation.count({
    where: {
      hive: {
        apiary: {
          userId,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }
  const session = await getServerSession(authOptions);
  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">{user.email} • Rol: {user.role}</span>
            <h1 className="platform-hero__title">{user.name}</h1>
            {session?.user?.role === 'SUPERADMIN' && (
              <div className="btn-group">
                <EditUserButton userId={userId} currentRole={user.role} />
                <DeleteUserButton
                  userId={userId}
                  userName={user.name}
                  currentRole={user.role}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Gebruikers', href: '/admin/users' }, { label: user.name }]} />

      <section className="home-features">
        <div className="container">
          <div className="home-features__grid">
            <Link href={`/admin/users/${userId}/apiaries`} className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Bijenstanden</span>
                  <span className="meta-value">
                    {user._count.apiaries}
                  </span>
                </div>
              </div>
            </Link>

            <Link href={`/admin/users/${userId}/hives`} className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Behuizingen</span>
                  <span className="meta-value">
                    {totalHives}
                  </span>
                </div>
              </div>
            </Link>

            <Link href={`/admin/users/${userId}/observations`} className="feature-card">
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Waarnemingen</span>
                  <span className="meta-value">
                    {totalObservations}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
