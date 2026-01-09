'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/client';

export default async function deleteUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'SUPERADMIN') {
    return { success: false, error: 'Geen toestemming' };
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true };
  } catch {
    return { success: false, error: 'Kon gebruiker niet verwijderen' };
  }
}
