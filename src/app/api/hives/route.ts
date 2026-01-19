import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { hiveSchema } from '@/lib/validators/schemas';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const hives = await prisma.hive.findMany({
      where: {
        apiary: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
        apiary: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ apiary: { name: 'asc' } }, { name: 'asc' }],
    });

    return NextResponse.json(hives);
  } catch (error) {
    console.error('Error fetching hives:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het ophalen van de behuizingen' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const body = await req.json();
    const { type, name, colonyType, apiaryId } = body;
    const validationResult = hiveSchema.safeParse({
      type,
      name,
      colonyType,
      apiaryId: parseInt(apiaryId),
    });
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      // after flatten: fieldErrors has type Record<string, string[]>
      return NextResponse.json(
        { ok: false, errors: fieldErrors },
        { status: 400 }
      );
    }
    const apiary = await prisma.apiary.findUnique({
      where: { id: parseInt(apiaryId) },
    });
    if (!apiary || apiary.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Ongeldige bijenstand of geen toegang.' },
        { status: 403 }
      );
    }

    // Maak behuizing aan
    const hive = await prisma.hive.create({
      data: {
        type,
        name,
        colonyType,
        apiaryId: parseInt(apiaryId),
      },
    });

    return NextResponse.json(hive, { status: 201 });
  } catch (error) {
    console.error('Error creating hive:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het aanmaken van de behuizing' },
      { status: 500 }
    );
  }
}
