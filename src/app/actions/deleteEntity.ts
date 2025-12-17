'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/client';
import { revalidatePath } from 'next/cache';

export async function deleteEntity(
  id: number,
  type: 'apiary' | 'hive' | 'observation'
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }
  if (type === 'apiary') {
    const apiary = await prisma.apiary.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (apiary?.userId !== session.user.id && session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    await prisma.apiary.delete({ where: { id } });
    revalidatePath('/apiaries');
  }
  if (type === 'hive') {
    const hive = await prisma.hive.findUnique({
      where: { id },
      select: { apiary: { select: { userId: true } } },
    });
    if (
      hive?.apiary.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      throw new Error('Unauthorized');
    }
    await prisma.hive.delete({ where: { id } });
    revalidatePath('/hives');
  }
  if (type === 'observation') {
    const observation = await prisma.observation.findUnique({
      where: { id },
      select: { hive: { select: { apiary: { select: { userId: true } } } } },
    });
    if (
      observation?.hive.apiary.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      throw new Error('Unauthorized');
    }
    await prisma.observation.delete({ where: { id } });
    revalidatePath('/observations');
  }
}
