import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import NewHiveForm from '@/components/forms/NewHiveForm';

export default async function AccountApiaryNewHivePage({
  searchParams,
}: {
  searchParams: Promise<{ apiaryId?: string; apiaryName?: string }>;
}) {
  const { apiaryId, apiaryName } = await searchParams;

  if (!apiaryId) {
    redirect('/account/apiaries');
  }
  const apiaryExists = await prisma.apiary.count({
    where: { id: parseInt(apiaryId) },
  });
  if (apiaryExists === 0) redirect('/account/apiaries');

  return <NewHiveForm apiaryId={apiaryId} apiaryName={apiaryName} />;
}
