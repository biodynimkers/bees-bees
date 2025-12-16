import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ apiaryId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }
    const { apiaryId } = await params;
    const id = parseInt(apiaryId);
    const apiary = await prisma.apiary.findUnique({
      where: { id },
    });
    if (!apiary) {
      return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 });
    }
    console.log('NextResponse:', apiary);
    return NextResponse.json(apiary);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ apiaryId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }
    const body = await req.json();
    const { name, latitude, longitude } = body;
    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Naam, latitude en longitude zijn verplicht' },
        { status: 400 }
      );
    }
    const { apiaryId } = await params;
    const id = parseInt(apiaryId);
    const apiary = await prisma.apiary.findUnique({
      where: { id },
    });
    if (!apiary) {
      return NextResponse.json(
        { error: 'Bijenstand niet gevonden' },
        { status: 404 }
      );
    }
    if (apiary.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Niet gemachtigd' }, { status: 403 });
    }
    const updatedApiary = await prisma.apiary.update({
      where: { id },
      data: {
        name,
        latitude,
        longitude,
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
export async function DELETE(
  req: NextRequest,
  { params }: { params: { apiaryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const apiaryId = parseInt(params.apiaryId);

    // Haal de apiary op inclusief userId
    const apiary = await prisma.apiary.findUnique({
      where: { id: apiaryId },
      select: { userId: true },
    });

    if (!apiary) {
      return NextResponse.json(
        { error: 'Bijenstand niet gevonden' },
        { status: 404 }
      );
    }

    // Check of de gebruiker eigenaar is (of admin)
    if (apiary.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Geen toestemming' }, { status: 403 });
    }

    // Verwijder de apiary
    await prisma.apiary.delete({
      where: { id: apiaryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting apiary:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwijderen van de bijenstand' },
      { status: 500 }
    );
  }
}
