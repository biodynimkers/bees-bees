import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/client";

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { hiveId, beeCount, pollenColor, notes } = body;

    // Valideer dat de hive bestaat en bij de user hoort
    const hive = await prisma.hive.findUnique({
      where: { id: hiveId },
      include: {
        apiary: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!hive || hive.apiary.user.email !== session.user.email) {
      return NextResponse.json({ error: "Hive not found" }, { status: 404 });
    }

    const observation = await prisma.observation.create({
      data: {
        hiveId,
        beeCount,
        pollenColor,
        notes,
      },
    });

    return NextResponse.json(observation, { status: 201 });
  } catch (error) {
    console.error("Error creating observation:", error);
    return NextResponse.json(
      { error: "Failed to create observation" },
      { status: 500 }
    );
  }
}
