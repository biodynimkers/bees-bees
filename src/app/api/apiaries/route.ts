import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET(req: Request) {
  return new Response("Apiaries endpoint");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const body = await req.json();
    const { name, location } = body;

    if (!name || !location) {
      return NextResponse.json(
        { error: "Naam en locatie zijn verplicht" },
        { status: 400 }
      );
    }

    // Haal userId op
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Gebruiker niet gevonden" },
        { status: 404 }
      );
    }

    // Maak bijenstand aan
    const apiary = await prisma.apiary.create({
      data: {
        name,
        location,
        userId: user.id,
      },
    });

    return NextResponse.json(apiary, { status: 201 });
  } catch (error) {
    console.error("Error creating apiary:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het aanmaken van de bijenstand" },
      { status: 500 }
    );
  }
}
