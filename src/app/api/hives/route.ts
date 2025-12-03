import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const body = await req.json();
    const { type, colonyType, apiaryId } = body;

    if (!type || !colonyType || !apiaryId) {
      return NextResponse.json(
        { error: "Type, colonyType en apiaryId zijn verplicht" },
        { status: 400 }
      );
    }

    // Maak kast aan
    const hive = await prisma.hive.create({
      data: {
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
