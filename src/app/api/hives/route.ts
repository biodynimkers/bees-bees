import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, colonyType, apiaryId } = body;

    if (!name || !type || !colonyType || !apiaryId) {
      return NextResponse.json(
        { error: "Naam, type, colonyType en apiaryId zijn verplicht" },
        { status: 400 }
      );
    }

    // Maak kast aan
    const hive = await prisma.hive.create({
      data: {
        name,
        type,
        colonyType,
        apiaryId: parseInt(apiaryId),
      },
    });

    return NextResponse.json(hive, { status: 201 });
  } catch (error) {
    console.error("Error creating hive:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het aanmaken van de kast" },
      { status: 500 }
    );
  }
}
