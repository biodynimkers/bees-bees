import { z } from 'zod';
export const registerSchema = z.object({
  name: z.string().min(1, 'Naam is vereist.'),
  email: z
    .string()
    .min(1, 'E-mailadres is verplicht.')
    .email('Voer een geldig e-mailadres in.'),
  //TODO before production, add a more robust password validation
  password: z.string().min(8, 'Wachtwoord moet minstens 8 tekens zijn.'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mailadres is verplicht.')
    .email('Voer een geldig e-mailadres in.'),
  password: z.string().min(8, 'Wachtwoord moet minstens 8 tekens zijn.'),
});
