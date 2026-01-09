import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';
import DeleteUserButton from '@/components/admin/DeleteUserButton';
import EditUserButton from '@/components/admin/EditUserButton';

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
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="heading-primary">{user.name}</h1>
          <p className="page-header__subtitle">{user.email}</p>
          <p className="page-header__subtitle">Rol: {user.role}</p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">Overzicht</h2>
            <Link href="/admin/users">
              <button className="btn btn--secondary">
                ← Terug naar alle imkers
              </button>
            </Link>
          </div>

          <div className="grid grid-three-columns">
            <div className="card">
              <h3 className="heading-tertiary">
                {user._count.apiaries === 0
                  ? 'Geen bijenstanden'
                  : user._count.apiaries > 1
                  ? `${user._count.apiaries} bijenstanden`
                  : `${user._count.apiaries} bijenstand`}
              </h3>
              {user._count.apiaries > 0 && (
                <Link href={`/admin/users/${userId}/apiaries`}>
                  <button className="btn btn--primary mt-4">
                    Bekijk{' '}
                    {user._count.apiaries > 1 ? 'bijenstanden' : 'bijenstand'}
                  </button>
                </Link>
              )}
            </div>

            <div className="card">
              <h3 className="heading-tertiary">
                {totalHives === 0
                  ? 'Geen kasten'
                  : totalHives > 1
                  ? `${totalHives} kasten`
                  : `${totalHives} kast`}
              </h3>
              {totalHives > 0 && (
                <Link href={`/admin/users/${userId}/hives`}>
                  <button className="btn btn--primary mt-4">
                    Bekijk {totalHives > 1 ? 'kasten' : 'kast'}
                  </button>
                </Link>
              )}
            </div>

            <div className="card">
              <h3 className="heading-tertiary">
                {totalObservations === 0
                  ? 'Geen observaties'
                  : totalObservations > 1
                  ? `${totalObservations} observaties`
                  : `${totalObservations} observatie`}
              </h3>
              {totalObservations > 0 && (
                <Link href={`/admin/users/${userId}/observations`}>
                  <button className="btn btn--primary mt-4">
                    Bekijk{' '}
                    {totalObservations > 1 ? 'observaties' : 'observatie'}
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-8">
            {session?.user?.role === 'SUPERADMIN' && (
              <>
                <DeleteUserButton userId={userId} userName={user.name} />
                <EditUserButton userId={userId} currentRole={user.role} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
