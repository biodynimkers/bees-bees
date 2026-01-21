# Bijen Observatie Platform

Modern platform voor bijenhouden en observaties.

## 🚀 Installatie

1. **Clone de repository**

   ```bash
   git clone https://github.com/pgmgent-2526-datamanagement/atwork3-bees-bees.git
   cd atwork3-bees-bees
   ```

2. **Installeer dependencies**

   ```bash
   npm install
   ```

3. **Configureer de database**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Configureer Mapbox API (optioneel, voor productie aanbevolen)**

   De app werkt direct met Nominatim (gratis, geen registratie). Voor productie is Mapbox aanbevolen:

   a. Maak een gratis account aan op [Mapbox](https://account.mapbox.com/auth/signup/)

   b. Ga naar [Access Tokens](https://account.mapbox.com/access-tokens/) en kopieer je default public token

   c. Maak een `.env.local` bestand in de root van het project:

   ```bash
   NEXT_PUBLIC_MAPBOX_TOKEN=jouw_mapbox_token_hier
   ```

   > **Zonder Mapbox:** De app gebruikt automatisch Nominatim (gratis OpenStreetMap service)
   >
   > **Met Mapbox:** 100.000 geocoding requests/maand, betere nauwkeurigheid en reliability
   >
   > **Voor productie:** De opdrachtgever dient een eigen Mapbox account aan te maken

5. **Configureer email service (voor wachtwoord reset)**

   De app gebruikt Resend voor email verzending. Voor volledige functionaliteit:

   a. Maak een gratis account aan op [Resend](https://resend.com/signup)

   b. Ga naar [API Keys](https://resend.com/api-keys) en maak een nieuwe API key aan

   c. Voeg de API key toe aan je `.env.local`:

   ```bash
   RESEND_API_KEY=re_jouw_api_key_hier
   ```

   > **Voor ontwikkeling:** Resend's test domain (`onboarding@resend.dev`) wordt gebruikt
   >
   > **Voor productie:** 3.000 gratis emails/maand, eigen domein mogelijk
   >
   > **Zonder Resend:** Wachtwoord reset functionaliteit werkt niet

6. **Start de development server**

   ```bash
   npm run dev
   ```

7. **Open in browser**

   Navigeer naar [http://localhost:3000](http://localhost:3000)

## 📧 Vercel Deployment (voor email functionaliteit)

Voor email functionaliteit in productie voeg deze environment variables toe aan Vercel:

```bash
RESEND_API_KEY=re_jouw_api_key_hier
NEXTAUTH_URL=https://jouw-vercel-app.vercel.app
```

## 🔐 Test Account

### Superadmin

- **Email:** superadmin@example.com
- **Wachtwoord:** test@123

### Admin

- Admins worden aangemaakt door de superadmin

by Stefaan & Joanna
