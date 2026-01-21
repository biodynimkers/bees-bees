import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/client';
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'csv';

  if (
    !session?.user?.id ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Haal alle data op
    const observations = await prisma.observation.findMany({
      include: {
        hive: {
          include: {
            apiary: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const hives = await prisma.hive.findMany({
      include: {
        apiary: true,
      },
    });

    const apiaries = await prisma.apiary.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Als Excel formaat gevraagd wordt
    if (format === 'excel') {
      // Maak data arrays voor elk werkblad
      const observationsData = [
        ['Datum', 'Bijenstand', 'Korf', 'Aantal bijen', 'Stuifmeelkleur', 'Stuifmeelhoeveelheid', 'Weer', 'Temperatuur', 'Notities'],
        ...observations.map((obs) => [
          new Date(obs.createdAt).toLocaleDateString('nl-BE'),
          obs.hive.apiary.name,
          obs.hive.name,
          obs.beeCount,
          obs.pollenColor,
          obs.pollenAmount,
          obs.weatherCondition,
          obs.temperature || '',
          obs.notes || '',
        ]),
      ];

      const hivesData = [
        ['Naam', 'Type', 'Bijenvolk', 'Bijenstand'],
        ...hives.map((hive) => [
          hive.name,
          hive.type,
          hive.colonyType,
          hive.apiary.name,
        ]),
      ];

      const apiariesData = [
        ['Naam', 'Locatie', 'Eigenaar'],
        ...apiaries.map((apiary) => [
          apiary.name,
          `${apiary.latitude}, ${apiary.longitude}`,
          apiary.user.name,
        ]),
      ];

      // Maak werkboek
      const wb = XLSX.utils.book_new();
      const wsObservations = XLSX.utils.aoa_to_sheet(observationsData);
      const wsHives = XLSX.utils.aoa_to_sheet(hivesData);
      const wsApiaries = XLSX.utils.aoa_to_sheet(apiariesData);

      XLSX.utils.book_append_sheet(wb, wsObservations, 'Waarnemingen');
      XLSX.utils.book_append_sheet(wb, wsHives, 'Korven');
      XLSX.utils.book_append_sheet(wb, wsApiaries, 'Bijenstanden');

      // Genereer Excel bestand als array buffer
      const excelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

      return new NextResponse(Buffer.from(excelBuffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="statistieken-${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      });
    }

    // Maak CSV
    let csv = '';

    // Waarnemingen
    csv += 'WAARNEMINGEN\n';
    csv += 'Datum,Bijenstand,Korf,Aantal bijen,Stuifmeelkleur,Stuifmeelhoeveelheid,Weer,Temperatuur,Notities\n';
    observations.forEach((obs) => {
      csv += `${new Date(obs.createdAt).toLocaleDateString('nl-BE')},`;
      csv += `${obs.hive.apiary.name},`;
      csv += `${obs.hive.name},`;
      csv += `${obs.beeCount},`;
      csv += `${obs.pollenColor},`;
      csv += `${obs.pollenAmount},`;
      csv += `${obs.weatherCondition},`;
      csv += `${obs.temperature || ''},`;
      csv += `"${obs.notes || ''}"\n`;
    });

    csv += '\n\nKORVEN\n';
    csv += 'Naam,Type,Bijenvolk,Bijenstand\n';
    hives.forEach((hive) => {
      csv += `${hive.name},`;
      csv += `${hive.type},`;
      csv += `${hive.colonyType},`;
      csv += `${hive.apiary.name}\n`;
    });

    csv += '\n\nBIJENSTANDEN\n';
    csv += 'Naam,Locatie,Eigenaar\n';
    apiaries.forEach((apiary) => {
      csv += `${apiary.name},`;
      csv += `"${apiary.latitude}, ${apiary.longitude}",`;
      csv += `${apiary.user.name}\n`;
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="statistieken-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
