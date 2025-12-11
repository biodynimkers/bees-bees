import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';
console.log('GET apiaryId route loaded');
export async function GET(
  _req: NextRequest,
  { params }: { params: { apiaryId: string } }
) {
  try {
    console.log('params:', params);
    const apiaryId = parseInt(params.apiaryId);
    if (isNaN(apiaryId)) {
      console.error('apiaryId is not a number:', params.apiaryId);
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    const apiary = await prisma.apiary.findUnique({
      where: { id: apiaryId },
    });
    if (!apiary) {
      return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 });
    }
    return NextResponse.json(apiary);
  } catch (error) {
    console.error('Error in GET apiary:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { apiaryId: string } }
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
    const apiaryId = parseInt(params.apiaryId);
    const apiary = await prisma.apiary.findUnique({
      where: { id: apiaryId },
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
      where: { id: apiaryId },
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
