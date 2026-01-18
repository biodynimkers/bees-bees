import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import crypto from 'crypto';
// TODO: Uncomment when RESEND_API_KEY is configured
// import { sendPasswordResetEmail } from '@/lib/email-service';

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
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 4. Save token to database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // 5. Send email with reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // TODO: Enable email sending when RESEND_API_KEY is configured
    // Temporarily commented out to prevent errors before Resend setup
    /*
    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetUrl,
      });

      console.log(`Password reset email sent to: ${email}`);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Delete the token if email fails
      await prisma.passwordResetToken.delete({
        where: { token },
      });

      return NextResponse.json(
        {
          error:
            'Er ging iets mis bij het versturen van de email. Probeer het opnieuw.',
        },
        { status: 500 },
      );
    }
    */

    // Temporary fallback: Log reset URL for testing
    console.log('='.repeat(60));
    console.log('PASSWORD RESET REQUEST');
    console.log('='.repeat(60));
    console.log(`Email: ${email}`);
    console.log(`Name: ${user.name}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token expires: ${expiresAt}`);
    console.log('='.repeat(60));

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
