import { HardDriveDownloadIcon } from 'lucide-react';
import { z } from 'zod';
import { be } from 'zod/locales';
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

export const apiarySchema = z.object({
  name: z.string().min(1, 'Naam is vereist.'),
  latitude: z
    .number()
    .optional() // needed to allow refine to work properly
    .refine(val => val !== undefined, { message: 'Latitude is vereist.' }),
  longitude: z
    .number()
    .optional()
    .refine(val => val !== undefined, { message: 'Longitude is vereist.' }),
});
export const hiveSchema = z.object({
  type: z.string().min(1, 'Type is vereist.'),
  name: z.string().optional(),
  colonyType: z.string().min(1, 'Colony type is vereist.'),
  apiaryId: z
    .number()
    .optional()
    .refine(val => val !== undefined, {
      message: 'Apiary ID moet een nummer zijn.',
    }),
});

export const newObservationSchema = z.object({
  hiveId: z
    .number()
    .optional() // needed to allow refine to work properly
    .refine(val => val !== undefined, { message: 'Kast ID is vereist.' }),
  beeCount: z
    .number()
    .optional()
    .refine(val => val !== undefined, { message: 'Bee count is vereist.' }),
  pollenAmount: z.enum(['WEINIG', 'GEMIDDELD', 'VEEL'], {
    message: 'Pollen amount is vereist.',
  }),
  pollenColor: z.string().min(1, 'Pollen color is vereist.'),
  weatherCondition: z.enum(['SUNNY', 'PARTLY_CLOUDY', 'CLOUDY', 'RAINY'], {
    message: 'Weersomstandigheden zijn vereist.',
  }),
  temperature: z.number().nullable().optional(),
  notes: z.string().optional(),
});
export const updateObservationSchema = z.object({
  beeCount: z
    .number()
    .optional()
    .refine(val => val !== undefined, { message: 'Bee count is vereist.' }),
  pollenAmount: z.enum(['WEINIG', 'GEMIDDELD', 'VEEL'], {
    message: 'Pollen amount is vereist.',
  }),
  pollenColor: z.string().min(1, 'Pollen color is vereist.'),
  weatherCondition: z.enum(['SUNNY', 'PARTLY_CLOUDY', 'CLOUDY', 'RAINY'], {
    message: 'Weersomstandigheden zijn vereist.',
  }),
  temperature: z.number().nullable().optional(),
  notes: z.string().optional(),
});
