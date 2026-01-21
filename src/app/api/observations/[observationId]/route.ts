import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';
import { updateObservationSchema } from '@/lib/validators/schemas';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ observationId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }
    const { observationId } = await params;
    const id = parseInt(observationId);
    const observation = await prisma.observation.findUnique({
      where: { id },
    });
    if (!observation) {
      return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 });
    }

    return NextResponse.json(observation);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ observationId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }
    const body = await req.json();
    const {
      beeCount,
      pollenColor,
      pollenAmount,
      weatherCondition,
      temperature,
      notes,
    } = body;

    const validationResult = updateObservationSchema.safeParse({
      beeCount: parseInt(beeCount),
      pollenColor,
      pollenAmount,
      weatherCondition,
      temperature: temperature ? parseFloat(temperature) : null,
      notes,
    });
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      return NextResponse.json(
        { ok: false, errors: fieldErrors },
        { status: 400 },
      );
    }
    const { observationId } = await params;
    const id = parseInt(observationId);
    const observation = await prisma.observation.findUnique({
      where: { id },
      include: {
        hive: {
          include: {
            apiary: {
              select: { userId: true },
            },
          },
        },
      },
    });
    if (!observation) {
      return NextResponse.json(
        { error: 'Bijenstand niet gevonden' },
        { status: 404 },
      );
    }
    if (
      observation.hive.apiary.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Niet gemachtigd' }, { status: 403 });
    }
    const updatedObservation = await prisma.observation.update({
      where: { id },
      data: {
        beeCount: validationResult.data.beeCount!,
        pollenColor: validationResult.data.pollenColor,
        pollenAmount: validationResult.data.pollenAmount,
        weatherCondition: validationResult.data.weatherCondition,
        temperature: validationResult.data.temperature,
        notes: validationResult.data.notes || null,
      },
    });
    return NextResponse.json(updatedObservation, { status: 200 });
  } catch (error) {
    console.error('Error updating apiary:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het bijwerken van de bijenstand' },
      { status: 500 },
    );
  }
}
