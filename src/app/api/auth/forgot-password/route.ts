import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'E-mailadres is vereist' },
        { status: 400 },
      );
    }

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        message: 'Als het e-mailadres bestaat, is een reset link verstuurd',
      });
    }

    // 2. Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // 3. Create reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 4. Save token to database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // 5. TODO: Send email via Supabase SMTP
    // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
    // await sendPasswordResetEmail(email, resetUrl)

    console.log(`Password reset token for ${email}: ${token}`); // Temporary for testing

    return NextResponse.json({
      message: 'Als het e-mailadres bestaat, is een reset link verstuurd',
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het opnieuw.' },
      { status: 500 },
    );
  }
}
