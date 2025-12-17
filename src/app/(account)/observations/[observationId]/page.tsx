import prisma from '@/lib/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';
import Link from 'next/link';
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
    redirect('/not-found');
  }
  if (
    observation.hive.apiary.userId !== session?.user.id &&
    session?.user.role !== 'ADMIN'
  ) {
    redirect('/unauthorized');
  }
  return (
    <div style={{ marginTop: '6rem' }}>
      <h1>Observation Detail Page</h1>
      <div>
        <h2>Observation ID: {observation.id}</h2>
        <p>Notes: {observation.notes}</p>
        <p>Date: {observation.createdAt.toDateString()}</p>
        <p>Hive ID: {observation.hive.id}</p>
        <p>Apiary Name: {observation.hive.apiary.name}</p>
      </div>
      <Link href={`observations/${observationId}/edit`}>
        Wijzig de observatie
      </Link>
      {observation && (
        <DeleteEntityButton
          id={observation.id}
          type="observation"
          label="Verwijder observatie"
        />
      )}
    </div>
  );
}
