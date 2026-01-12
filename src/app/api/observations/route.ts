import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { newObservationSchema } from '@/lib/validators/schemas';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Geen toegang' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { hiveId, beeCount, pollenColor, notes } = body;
    const validationResult = newObservationSchema.safeParse({
      hiveId: parseInt(hiveId),
      beeCount: parseInt(beeCount),
      pollenColor,
      notes,
    });
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      return NextResponse.json(
        { ok: false, errors: fieldErrors },
        { status: 400 }
      );
    }

    // Valideer dat de hive bestaat en bij de user hoort
    const hive = await prisma.hive.findUnique({
      where: { id: hiveId },
      include: {
        apiary: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!hive || hive.apiary.user.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Bijenkast niet gevonden' },
        { status: 404 }
      );
    }

    const observation = await prisma.observation.create({
      data: {
        hiveId,
        beeCount,
        pollenColor,
        notes,
      },
    });

    return NextResponse.json(observation, { status: 201 });
  } catch (error) {
    console.error('Error creating observation:', error);
    return NextResponse.json(
      { error: 'Observatie kon niet worden aangemaakt' },
      { status: 500 }
    );
  }
}
