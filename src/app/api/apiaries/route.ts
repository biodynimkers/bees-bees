import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

// export async function GET(req: Request) {
//   return new Response('Apiaries endpoint');
// }

export async function POST(req: Request) {
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

    // Haal userId op
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    // Maak bijenstand aan
    const apiary = await prisma.apiary.create({
      data: {
        name,
        longitude,
        latitude,
        userId,
      },
    });

    return NextResponse.json(apiary, { status: 201 });
  } catch (error) {
    console.error('Error creating apiary:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het aanmaken van de bijenstand' },
      { status: 500 }
    );
  }
}
