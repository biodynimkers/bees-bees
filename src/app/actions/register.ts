'use server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/client';
import { registerSchema } from '@/lib/validators/schemas';

// avoid importing Prisma error class which can have typing issues in this environment
export type RegisterResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string[]> }; // is a utility type in TypeScript dat describes an object type.

// Server action to create a user. Returns structured fieldErrors when validation fails.
export async function createItem(formData: FormData): Promise<RegisterResult> {
  // Convert FormData to plain object. Values should be strings for our fields.
  const rawFormData = Object.fromEntries(formData.entries()) as Record<
    string,
    unknown
  >;
  // Validate and parse input data with Zod's safeParse method
  const validationResult = registerSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    // after flatten: fieldErrors has type Record<string, string[]>
    return { ok: false, errors: fieldErrors };
  }

  const { name, email, password } = validationResult.data;

  const saltRounds = Number(process.env.SALT_ROUNDS ?? '10');
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return { ok: true };
  } catch (err: unknown) {
    // 1. Check of err een object is (en niet null)
    if (typeof err === 'object' && err !== null) {
      // 2. Type assertion: vertel TS dat dit object mogelijk een 'code' property heeft
      const maybeCode = (err as { code?: unknown })?.code;

      // 3. Check of code === 'P2002' (Prisma's unique constraint code)
      if (maybeCode === 'P2002') {
        return {
          ok: false,
          errors: { email: ['E-mailadres is al in gebruik.'] },
        };
      }
    }
    throw err;
  }
}
