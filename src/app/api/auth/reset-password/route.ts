import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import bcrypt from 'bcrypt';
import { resetPasswordApiSchema } from '@/lib/validators/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = resetPasswordApiSchema.safeParse(body);
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      return NextResponse.json(
        { error: 'Ongeldige invoer', details: fieldErrors },
        { status: 400 },
      );
    }

    const { token, password } = validationResult.data;

    // 1. Find valid token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() }, // Token must not be expired
      },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Ongeldige of verlopen token' },
        { status: 400 },
      );
    }

    // 2. Hash the new password
    const saltRounds = Number(process.env.SALT_ROUNDS ?? '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { hashedPassword },
    });

    // 4. Delete the used token (and any other tokens for this user)
    await prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    return NextResponse.json({
      message:
        'Wachtwoord succesvol gewijzigd. U kunt nu inloggen met uw nieuwe wachtwoord.',
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het opnieuw.' },
      { status: 500 },
    );
  }
}
