import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ observationId: string }> }
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
    console.log('NextResponse:', observation);
    return NextResponse.json(observation);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ observationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }
    const body = await req.json();
    const { beeCount, pollenColor, notes } = body;
    if (beeCount === undefined || !pollenColor) {
      return NextResponse.json(
        { error: 'aantal bijen en pollenkleur zijn verplicht' },
        { status: 400 }
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
        { status: 404 }
      );
    }
    if (
      observation.hive.apiary.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Niet gemachtigd' }, { status: 403 });
    }
    const updatedApiary = await prisma.observation.update({
      where: { id },
      data: {
        beeCount,
        pollenColor,
        notes,
      },
    });
    return NextResponse.json(updatedApiary, { status: 200 });
  } catch (error) {
    console.error('Error updating apiary:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het bijwerken van de bijenstand' },
      { status: 500 }
    );
  }
}
