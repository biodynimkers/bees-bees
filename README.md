# 🐝 Bijen Observatie Platform

**Door: Stefaan & Joanna**  
Een modern full-stack platform voor bijenhouders om hun bijenstanden, bijenkasten en waarnemingen digitaal te beheren en analyseren.

---

## 📋 Inhoudsopgave

- [Over het Project](#-over-het-project)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Credentials](#-credentials)
- [Installatie](#-installatie)
- [Features](#-features)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)

---

## 📖 Over het Project

Dit platform is ontwikkeld voor bijenhouders om:

- 📍 **Bijenstanden beheren** met GPS-locaties en kaartvisualisatie
- 🏠 **Bijenkasten registreren** met verschillende types en kolonie-informatie
- 👁️ **Waarnemingen bijhouden** inclusief bijenaantallen, stuifmeelkleuren en weerscondities
- 🌸 **Drachtkalender raadplegen** met 60+ planten en bloeiperiodes
- 📊 **Statistieken analyseren** met grafieken en export functionaliteit
- 🗺️ **Foerageergebied visualiseren** met cirkels van 200m, 2km en 7km

### Doelgroep

- Hobbybijenhouders
- Professionele imkers
- Bijenverenigingen
- Onderzoeksinstellingen

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.5.7** - React framework met App Router en Server Components
- **React 19.1.2** - UI library
- **TypeScript 5** - Type safety
- **Leaflet & React Leaflet** - Interactieve kaarten
- **Mapbox GL** - Geocoding en premium kaarten
- **Lucide React** - Icon library
- **Zod** - Runtime validatie

### Backend

- **Next.js API Routes** - RESTful API
- **NextAuth 4.24** - Authenticatie en sessie management
- **Prisma 6.16** - Type-safe ORM
- **PostgreSQL** - Database (Vercel Postgres)
- **Bcrypt** - Password hashing
- **Resend** - Email service

### Services & APIs

- **Mapbox API** - Geocoding (fallback: Nominatim)
- **GBIF API** - Plant observaties
- **Waarnemingen.be API** - Lokale plant data

---

## 🗄️ Database Schema

### Relaties

```
User (1) ──→ (n) Apiary (1) ──→ (n) Hive (1) ──→ (n) Observation
                     ↓
                     (n)
                ApiaryPlant (n) ──→ (1) Plant
```

### Belangrijkste Modellen

**User**

- Authenticatie met rollen (USER, ADMIN, SUPERADMIN)
- Wachtwoord reset functionaliteit

**Apiary** (Bijenstand)

- Naam, GPS locatie (latitude/longitude)
- Relatie met gebruiker
- Cascade delete bij verwijdering gebruiker

**Hive** (Bijenkast)

- Unieke naam per bijenstand
- Type (Korf, Langstroth, Dadant, etc.)
- Kolonie type (Buckfast, Carnica, etc.)
- Cascade delete bij verwijdering bijenstand

**Observation** (Waarneming)

- Aantal bijen (30 seconden telling)
- Stuifmeelkleur en hoeveelheid (GEEN, WEINIG, GEMIDDELD, VEEL)
- Weersomstandigheden (SUNNY, CLOUDY, RAINY, UNKNOWN)
- Temperatuur en notities
- Timestamps voor tracking

**Plant & ApiaryPlant**

- 60+ planten met Nederlandse en Latijnse namen
- Bloeiperiodes (standaard + custom per bijenstand)
- Forage intensiteit (LOW, MEDIUM, HIGH)
- Dracht type (nectar, pollen, beide)

---

## 🔐 Credentials

### Test Accounts

#### Superadmin (Volledige toegang)

```
Email: superadmin@example.com
Wachtwoord: test@123
```

**Rechten:**

- Alle admin functies
- Gebruikers verwijderen
- Rollen wijzigen (USER ↔️ ADMIN)
- Hero afbeelding uploaden

#### Admin (Read-only + moderatie)

**Hoe aanmaken:**

1. Log in als superadmin
2. Ga naar `/admin/users`
3. Klik "Maak admin" bij een USER account

**Rechten:**

- Alle data bekijken
- Data verwijderen (bijenstanden, kasten, observaties)
- Statistieken exporteren
- ❌ Geen gebruikersbeheer

#### Regular User

**Aanmaken:**

- Via registratieformulier op `/auth/register`

**Rechten:**

- Eigen bijenstanden, kasten en observaties beheren
- Drachtkalender raadplegen
- ❌ Geen toegang tot admin panel

---

## 🚀 Installatie

### 1. Clone de repository

```bash
git clone https://github.com/pgmgent-2526-datamanagement/atwork3-bees-bees.git
cd atwork3-bees-bees
```

### 2. Installeer dependencies

```bash
npm install
```

### 3. Environment variables

Maak een `.env` bestand aan in de root:

```env
# Database (Vercel Postgres)
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="jouw-random-secret-key-hier"
NEXTAUTH_URL="http://localhost:3000"

# Mapbox (optioneel - fallback naar Nominatim)
NEXT_PUBLIC_MAPBOX_TOKEN="pk.ey..."

# Resend Email (optioneel - voor wachtwoord reset)
RESEND_API_KEY="re_..."
```

#### 📍 Mapbox Setup (Optioneel)

De app werkt direct met Nominatim (gratis, geen registratie). Voor productie is Mapbox aanbevolen:

a. Maak een gratis account aan op [Mapbox](https://account.mapbox.com/auth/signup/)
b. Ga naar [Access Tokens](https://account.mapbox.com/access-tokens/) en kopieer je default public token
c. Voeg toe aan `.env`

> **Zonder Mapbox:** Nominatim (gratis OpenStreetMap service)
> **Met Mapbox:** 100.000 requests/maand, betere nauwkeurigheid

#### 📧 Resend Email Setup (Voor wachtwoord reset)

a. Maak een gratis account aan op [Resend](https://resend.com/signup)
b. Ga naar [API Keys](https://resend.com/api-keys) en maak een nieuwe key aan
c. Voeg toe aan `.env`

> **Voor ontwikkeling:** Test domain `onboarding@resend.dev`
> **Voor productie:** 3.000 gratis emails/maand
> **Zonder Resend:** Wachtwoord reset werkt niet

````

### 4. Database setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optioneel) Seed data
npx prisma db seed
````

### 5. Start development server

```bash
npm run dev
```

### 6. Open browser

Navigeer naar [http://localhost:3000](http://localhost:3000)

---

## ✨ Features

### Voor Gebruikers

#### 📍 Bijenstand Beheer

- Meerdere bijenstanden aanmaken
- **Locatie via adres** (desktop): Automatische geocoding via Mapbox/Nominatim
- **Locatie via GPS** (mobiel): Browser geolocation API
- **Interactieve kaart** met versleepbare marker
- **Foerageergebied** visualisatie (200m, 2km, 7km cirkels)
- **GBIF integratie**: Bekijk plant observaties in de buurt

#### 🏠 Bijenkast Tracking

- Verschillende kast types (Korf, Langstroth, Dadant, Top Bar, Warre, etc.)
- Kolonie types (Buckfast, Carnica, Ligustica, Caucasica, etc.)
- Koppeling aan bijenstand
- Overzicht met aantal waarnemingen

#### 👁️ Waarnemingen Registreren

**Gestandaardiseerd proces:**

1. **30 seconden timer** met aftelling (3-2-1)
2. **Bijen tellen** met sneltoetsen (+1, +5, +10, +20)
3. **Stuifmeel observeren**:
   - 12 kleuren beschikbaar (max 3 selecteren)
   - Hoeveelheid: Geen/Weinig/Gemiddeld/Veel
   - Tooltip toont mogelijke plantensoorten
4. **Weer vastleggen**: Zonnig, Bewolkt, Regenachtig, Mistig
5. **Temperatuur** (optioneel)
6. **Notities** (vrij veld)

#### 🌸 Drachtkalender

- 60+ planten met bloeiperiodes
- Nederlandse en Latijnse namen
- Forage intensiteit indicator
- Filter per maand
- Type indicatie (nectar, pollen, beide)

#### 🗺️ Kaarten & Visualisatie

- Mapbox/Leaflet integratie
- Address autocomplete
- Fullscreen modus
- Responsive design

### Voor Admins

#### 👥 Gebruikersbeheer (SUPERADMIN only)

- Overzicht alle gebruikers
- Zoeken en filteren met debounce
- Rollen wijzigen (USER ↔️ ADMIN)
- Gebruikers verwijderen (cascade delete)
- SUPERADMIN kan niet gewijzigd worden

#### 📊 Statistieken Dashboard

- Grafieken voor:
  - Stuifmeelkleuren verdeling
  - Stuifmeelhoeveelheden
  - Weerscondities
  - Hive types
  - Colony types
- **Export functie**: Download als CSV of Excel
- Filter opties
- Real-time data

#### 🔍 Data Overzicht

- Alle bijenstanden van alle gebruikers
- Alle behuizingen met details
- Alle waarnemingen in tabelvorm
- Paginatie (20 items per pagina)
- Zoeken en filteren

#### 🖼️ Hero Afbeelding Upload (SUPERADMIN only)

**Client-side compressie:**

- Max upload: 800KB (na compressie)
- Automatische resize naar 1920x1080
- JPEG compressie met 90% kwaliteit
- Canvas API voor smoothing
- Alt text voor SEO

---

## 🔌 API Endpoints

### Authenticatie

```
POST /api/auth/register      - Registreren
POST /api/auth/signin        - Inloggen
POST /api/auth/signout       - Uitloggen
```

### Bijenstanden

```
GET    /api/apiaries         - Lijst (met paginatie)
POST   /api/apiaries/new     - Aanmaken
GET    /api/apiaries/:id     - Details
PUT    /api/apiaries/:id     - Updaten
DELETE /api/apiaries/:id     - Verwijderen
```

### Bijenkasten

```
GET    /api/hives            - Lijst (met paginatie)
POST   /api/hives/new        - Aanmaken
GET    /api/hives/:id        - Details
PUT    /api/hives/:id        - Updaten
DELETE /api/hives/:id        - Verwijderen
```

### Observaties

```
GET    /api/observations     - Lijst (met paginatie)
POST   /api/observations/new - Aanmaken
GET    /api/observations/:id - Details
PUT    /api/observations/:id - Updaten
DELETE /api/observations/:id - Verwijderen
```

### Admin

```
GET    /api/admin/users      - Alle gebruikers (ADMIN/SUPERADMIN)
DELETE /api/admin/users/:id  - Verwijder gebruiker (SUPERADMIN only)
POST   /api/hero             - Upload hero afbeelding (SUPERADMIN only)
```

---

## 🌐 Deployment

### Vercel (Aanbevolen)

1. **Push naar GitHub**

```bash
git push origin main
```

2. **Connect to Vercel**

- Ga naar [vercel.com](https://vercel.com)
- Import project vanuit GitHub
- Framework: Next.js (auto-detect)

3. **Environment Variables**
   Voeg toe in Vercel dashboard:

```env
POSTGRES_PRISMA_URL=your_database_url
POSTGRES_URL_NON_POOLING=your_direct_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
RESEND_API_KEY=your_resend_key
```

4. **Database Setup**

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

### PostgreSQL Database

**Opties:**

- Vercel Postgres (aanbevolen)
- Supabase
- Railway
- Neon
- Eigen server

---

## 📁 Project Structuur

```
atwork3-bees-bees/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migraties
├── public/
│   └── assets/                 # Statische bestanden
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (account)/         # Gebruiker routes
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # API routes
│   │   └── auth/              # Authenticatie pages
│   ├── components/            # React componenten
│   │   ├── admin/             # Admin specifiek
│   │   ├── auth/              # Auth formulieren
│   │   ├── forms/             # Data formulieren
│   │   ├── home/              # Homepage
│   │   └── shared/            # Herbruikbaar
│   ├── lib/                   # Utilities
│   │   ├── auth-helpers.ts    # Auth checks
│   │   ├── auth-options.ts    # NextAuth config
│   │   ├── client.ts          # Prisma client
│   │   └── validators/        # Zod schemas
│   ├── styles/                # CSS modules
│   └── types/                 # TypeScript types
└── package.json
```

---

## 🔒 Beveiliging

### Authenticatie

- NextAuth credentials provider
- Bcrypt password hashing (rounds: 10)
- Session-based auth
- HTTP-only cookies

### Autorisatie

- Middleware route protection
- Server-side role checks
- Ownership validation
- CSRF protection

### Database

- Cascade deletes
- Foreign key constraints
- Prepared statements (Prisma)
- Connection pooling

### API

- Input validation (Zod)
- Error handling
- Rate limiting (via Vercel)
- CORS configured

---

## 🐛 Bekende Issues

1. **Hive edit**: Type behuizing niet voorgeselecteerd in edit form
2. **Observation redirect**: Na edit gaat gebruiker naar verkeerde pagina
3. **Pollen amount**: Verplicht zelfs bij "GEEN" kleur selectie
4. **Temperature**: Geeft altijd 20°C terug als default

Zie `todos.md` voor volledige lijst.

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build voor productie
npm run start        # Start productie server
npm run postinstall  # Generate Prisma Client (auto)
```

---

## 🎓 Project Info

**Schoolproject:** Data Management  
**Studenten:** Stefaan & Joanna  
**Instituut:** Arteveldehogeschool  
**Academiejaar:** 2025-2026  
**Repository:** [pgmgent-2526-datamanagement/atwork3-bees-bees](https://github.com/pgmgent-2526-datamanagement/atwork3-bees-bees)

---

## 📄 Licentie

Dit project is ontwikkeld voor educatieve doeleinden.

---

**Happy Beekeeping! 🐝🍯**
