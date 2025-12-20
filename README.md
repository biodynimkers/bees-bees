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

5. **Start de development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**

   Navigeer naar [http://localhost:3000](http://localhost:3000)

## 🔐 Test Accounts

### Gebruiker

- **Email:** lola@test.com
- **Wachtwoord:** lola123456

### Admin

- **Email:** admin@example.com
- **Wachtwoord:** test@123

by stefaan & joanna
