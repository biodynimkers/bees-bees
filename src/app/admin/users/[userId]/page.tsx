import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const session = await requireAdmin();

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

  if (!user) {
    notFound();
  }

  return (
    <section className="page-header">
      <div className="container">
        <h1 className="page-header__title">{user.name}</h1>
        <p className="page-header__subtitle">{user.email}</p>
        <p>
          {' '}
          {user.name} heeft
          {user._count.apiaries === 0
            ? ' nog geen bijenstanden'
            : user._count.apiaries > 1
            ? ` ${user._count.apiaries} bijenstanden`
            : ` ${user._count.apiaries} bijenstand`}
        </p>
        {user._count.apiaries ? (
          <Link href={`/admin/users/${userId}/apiaries`}>
            Bekijk de
            {user._count.apiaries > 1 ? ' bijenstanden' : ' bijenstand'}
          </Link>
        ) : (
          ''
        )}
        <Link href={'../../admin/users'}>Terug naar alle imkers</Link>
      </div>
    </section>
  );
}
