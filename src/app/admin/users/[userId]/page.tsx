import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    notFound();
  }

  return (
    <section className="page-header">
      <div className="container">
        <h1 className="page-header__title">{user.name}</h1>
        <p className="page-header__subtitle">{user.email}</p>
      </div>
    </section>
  );
}
