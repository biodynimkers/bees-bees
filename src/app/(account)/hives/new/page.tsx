import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import NewHiveForm from '@/components/forms/NewHiveForm';

export default async function AccountApiaryNewHivePage({
  searchParams,
}: {
  searchParams: { apiaryId?: string; apiaryName?: string };
}) {
  const apiaryId = searchParams.apiaryId;
  const apiaryName = searchParams.apiaryName;
  if (!apiaryId) {
    redirect('/account/apiaries');
  }
  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: { name: true },
  });

  if (!apiary) redirect('/account/apiaries');

  return <NewHiveForm apiaryId={apiaryId} apiaryName={apiaryName} />;
}
