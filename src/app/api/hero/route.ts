import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { image, altText } = data;

    if (!image || !altText) {
      return NextResponse.json({ error: 'Image en alt text verplicht' }, { status: 400 });
    }

    // Verwijder base64 prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Sla op in public/assets/
    const publicPath = join(process.cwd(), 'public', 'assets', 'hero-custom.jpg');
    await writeFile(publicPath, buffer);

    // Sla alt text op in een JSON file
    const altTextPath = join(process.cwd(), 'public', 'assets', 'hero-alt.json');
    await writeFile(altTextPath, JSON.stringify({ alt: altText }));

    return NextResponse.json({ 
      success: true, 
      message: 'Hero afbeelding opgeslagen',
      url: '/assets/hero-custom.jpg'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
