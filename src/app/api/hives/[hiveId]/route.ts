import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hiveId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }
    const { hiveId } = await params;
    const id = parseInt(hiveId);
    const hive = await prisma.hive.findUnique({
      where: { id },
    });
    if (!hive) {
      return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 });
    }
    console.log('NextResponse:', hive);
    return NextResponse.json(hive);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ hiveId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }
    const body = await req.json();
    const { type, colonyType } = body;
    if (type === undefined || colonyType === undefined) {
      return NextResponse.json(
        { error: 'Type en Kolonietype zijn verplicht' },
        { status: 400 }
      );
    }
    const { hiveId } = await params;
    const id = parseInt(hiveId);
    const hive = await prisma.hive.findUnique({
      where: { id },
      include: {
        apiary: {
          select: { userId: true },
        },
      },
    });
    if (!hive) {
      return NextResponse.json(
        { error: 'Kast niet gevonden' },
        { status: 404 }
      );
    }
    if (
      hive.apiary.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Niet gemachtigd' }, { status: 403 });
    }
    const updatedHive = await prisma.hive.update({
      where: { id },
      data: {
        type,
        colonyType,
      },
    });
    return NextResponse.json(updatedHive, { status: 200 });
  } catch (error) {
    console.error('Error updating hive:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het bijwerken van de kast' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ hiveId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const { hiveId } = await params;
    const id = parseInt(hiveId);
    const hive = await prisma.hive.findUnique({
      where: { id },
      include: {
        apiary: {
          select: { userId: true },
        },
      },
    });

    if (!hive) {
      return NextResponse.json(
        { error: 'Kast niet gevonden' },
        { status: 404 }
      );
    }

    // Check of de gebruiker eigenaar is (of admin)
    if (
      hive.apiary.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Geen toestemming' }, { status: 403 });
    }

    // Verwijder de hive
    await prisma.hive.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hive:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwijderen van de kast' },
      { status: 500 }
    );
  }
}
