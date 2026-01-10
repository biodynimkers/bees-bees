# 🐝 Bijenstandbeheer Applicatie - Ontwikkelingsplan

## 📊 Project Status Overzicht

**Next.js v15.5.2** • **Prisma v6.16.3** • **NextAuth v4.24.13**

---

## 🎯 FASE 1: Fundament & Database

### ✅ 1. Next.js Project Initialisatie

- **Status**: Voltooid
- Next.js v15.5.2 geïnstalleerd en geconfigureerd

### ✅ 2. Prisma Database Modellen

- **Status**: Voltooid
- Prisma v6.16.3 geïmplementeerd
- Database schema met alle benodigde modellen

### ✅ 3. Authenticatie Systeem

- **Status**: Voltooid
- NextAuth v4.24.13 geïnstalleerd
- API route (`route.ts`) met correcte imports
- Type uitbreidingen in `next-auth.d.ts` voor rollen en ID's

### 🔄 4. Beveiliging & Toegangscontrole

- [x] **Middleware aanmaken**: `src/middleware.ts` voor route bescherming
- [x] **Hulpfuncties**: `src/lib/auth-helpers.ts` voor rechtencontrole (`isAdmin`, `isOwner`),
- [x] **Rolgebaseerde autorisatie** implementeren in sessies

---

## ⚡ FASE 2: Backend API Ontwikkeling

**Doel**: Complete backend met foutafhandeling, validatie en autorisatie

### 🔐 Authenticatie Endpoints

- [x] **POST** `/api/auth/register` → Gebruikersregistratie
- [x] **POST** `/api/auth/signin` → Inloggen met custom formulier

### 🏠 Bijenstand Beheer

- [x] **GET** `/api/apiaries` → Overzicht eigen bijenstanden
- [x] **GET** `/api/apiaries` → paginering van het overzicht
- [x] **POST** `/api/apiaries/new` → Nieuwe bijenstand aanmaken
- [x] **GET** `/api/apiaries/:id` → Bijenstand details ophalen TODO foutafhandeling met try-catch voorzien voor als de fetch mislukt!
- [x] **UPDATE** `/api/apiaries/:id` → Bijenstand aanpassen
- [x] **DELETE** `/api/apiaries/:id` → Bijenstand verwijderen

### 📦 Kast & Observatie Beheer

- [x] → Elke kast een unieke naam of nummer geven per bijenstand
- [x] **GET** `/api/hives` → Overzicht eigen kasten
- [x] **GET** `/api/hives` → paginering van het overzicht
- [x] **POST** `/api/hives/new` → Nieuwe kast toevoegen
- [x] **GET** `/api/observations` → Observaties lijst
- [x] **GET** `/api/observations` → paginering van het overzicht
- [x] **GET** `/api/observations/:id` → Observatie detail
- [x] **POST** `/api/observations/new` → Nieuwe observatie registreren TODO: het uurverschil eruithalen
- [x] **UPDATE** `/api/hives/:id` → Bijenkast aanpassen
- [x] **DELETE** `/api/hives/:id` → Bijenkast verwijderen
- [x] **UPDATE** `/api/observations/:id` → Observatie aanpassen
- [x] **DELETE** `/api/observations/:id` → Observatie verwijderen

### 👥 Gebruikersbeheer (Beheerder)

-[] de volgende admin structuur stap per stap uitwerken:

app/admin/
├── page.tsx # Dashboard met overall stats
├── users/
│ ├── page.tsx # Lijst alle users (tabel)
│ └── [userId]/
│ ├── page.tsx # User overview met stats
│ ├── apiaries/
│ │ └── page.tsx # Read-only lijst
│ ├── hives/
│ │ └── page.tsx # Read-only lijst
│ └── observations/
│ └── page.tsx # Read-only lijst + delete button
├── apiaries/
│ └── page.tsx # ALLE apiaries (flat lijst)
├── hives/
│ └── page.tsx # ALLE hives (flat lijst)
└── observations/
└── page.tsx # ALLE observations (flat lijst)

- [x] een rol toevoegen in schema.prisma 'SUPERADMIN'
- [x] superadmin kan users admin maken
- [x] enkel superadmin kan user deleten

- [x] **GET** `/admin/users` → Alle gebruikers tonen (alleen beheerders)
- [x] **DELETE** `/admin/users/:id` → Gebruiker verwijderen (alleen beheerders) + cascade toevoegen aan Apiary
- [x] → filter gebruikers (alleen beheerders)
- [x] **GET** `/admin/users/:id` → User overview met stats
- [x] **GET** `/admin/users/:id/apiaries` → Read-only lijst
- [x] **GET** `/admin/users/:id/hives` → Read-only lijst
- [x] **GET** `/admin/users/:id/observations` → Read-only lijst
- [x] **GET** `/admin/apiaries` → Read-only lijst
- [x] **GET** `/admin/hives` → Read-only lijst
- [x] **GET** `/admin/observations` → Read-only lijst
- [x] dynamische terugkeerUrls in [hiveId]
- [x] dynamische terugkeerUrls in [apiaryId]
<!-- - [] dynamische terugkeerUrls in [observationsId]--> niet nodig, staan al uitgeschreven onder kasten
- [x] dynamische terugkeerUrls in admin/hives en admin/users/[userId]/hives
- [x] dynamische terugkeerUrls in admin/observations en admin/users/[userId]/observations
- [x] dynamische terugkeerUrls in admin/apiaries en admin/users/[userId]/apiaries
- [x] paginering voorzien voor admin/users en admin/users/userId/apiaries
- [x] paginering voorzien voor admin/apiaries etc.
- [x] paginering voorzien voor admin/hives etc.
- [x] paginering voorzien voor admin/observations etc.
- [x] admin/users/[userId] voorzien van een terugbutton
- [x] usersfilter eruithalen

---

## 🎨 FASE 3: Frontend Basis & Navigatie

### 5. Applicatie Layout

- [x] **Hoofdlayout** (`layout.tsx`): Twee Google Fonts importeren + navigatiebalk
- [x] **Home Page** (`page.tsx`): Direct server action for the data expected
- [x] **Navigatiecomponent** (`src/components/Navbar.tsx`): Rolgebaseerde links
- [x] **Globale stijlen** (`src/app/globals.css`): Alleen écht globale CSS
- [x] **Configuratie** (`next.config.ts`): Lettertype optimalisatie
- [ ] scrollbare nav
- [ ] fotos comprimeren
- [ ] alt teksten
- [ ] responsief design
- [ ] website consistent
- [ ] leaflet kaart
- [ ] API aanvragen via waarnemingen
- [ ] mobiele breakpoints
- [ ] unauthorized page nog text en styling geven
- [ ] ook bij mobiel tabellen niet veranderen in kaartjes (zie gesprek Barend)
- [ ] 'gebruikers' vervangen door 'leden'

### 6. Openbare Pagina's

- [x] **Startpagina** (`/`): Hero sectie + projectoverzicht
- [x] **Over Ons** (`/about`): Informatiepagina over het project
- [x] **Registratie** (`/register`): Aanmeldformulier
- [x] **Inlogpagina** (`/api/auth/signin`): Login interface
- [] **Registratie** (`/register`): Aanmeldformulier: paswoord dubbel typen
- [] **Inlogpagina** (`/api/auth/signin`): Login interface: paswoord zichtbaar maken
- [] **Inlogpagina** (`/api/auth/signin`): Login interface: "paswoord vergeten?"

---

## 🔒 FASE 4: Beveiligde Gebruikersgebieden

### 7. Imker Functionaliteiten

- [x] **Profiel** (`/imkers/:id`): Persoonlijke bijenstanden, kasten en observaties
- [x] **Observatie Toevoegen** (`/observaties/new`): Formulier voor nieuwe waarnemingen
- [x] **Eigen Data Beheer**: Volledige CRUD voor eigen content

### 8. Beheerder Dashboard

- [x] **Gebruikersoverzicht** (`/imkers`): Lijst alle imkers met verwijder-opties
- [x] **Volledige Toegang**: Inzage in alle bijenstanden en observaties
- [x] **Moderatie Tools**: Content beheer en gebruikerscontrole

### 9. Publiek Toegankelijke Content

- [x] **Observaties Overzicht** (`/observaties`): Gepagineerde, doorzoekbare lijst
- [x] **Weergave Gegevens**: Datum, imkernaam, kast, notities, locatie (regio)
- [x] **Filter & Zoek Functionaliteit**: Gebruiksvriendelijke navigatie

---

## ✨ FASE 5: Gebruikerservaring & Optimalisatie

### 10. Formulier Validatie & Feedback TODO

- [ ] **Server-side Validatie**: Zod bibliotheek of custom validatie
- [ ] **Real-time Feedback**: Client-side validatie
- [ ] **Gebruiksvriendelijke Meldingen**: Duidelijke foutboodschappen per veld

### 11. Media & Visuele Elementen

- [ ] **Afbeeldingen Toevoegen**: Minimaal 2 afbeeldingen (bijv. homepage hero, about banner)
- [ ] **Next.js Optimalisatie**: `<Image>` component voor prestaties
- [ ] **Responsive Design**: Mobiel-vriendelijke afbeeldingen

### 12. Foutafhandeling & Gebruikerservaring

- [ ] **Globale Foutafhandeling** (`src/app/error.tsx`): Algemene error fallback
- [ ] **404 Pagina** (`src/app/not-found.tsx`): Aangepaste niet-gevonden pagina
- [ ] **Catch-all Route** (`src/app/[...slug]/page.tsx`): Onbekende routes afvangen
- [ ] **Rolgebaseerde Foutmeldingen**: 403/401 berichten per gebruikerstype

### 13. Prestatie & Laadstatus

- [ ] **Laad Indicatoren** (`src/app/[route]/loading.tsx`): Per pagina loading states
- [ ] **React Suspense**: Async data loading boundaries
- [ ] **Gebruikersfeedback**: Visuele indicatie van systeemstatus

### 14. Zoekmachine Optimalisatie

- [ ] **Statische Metadata**: Titel en beschrijving voor vaste pagina's
- [ ] **Dynamische Metadata**: `generateMetadata()` voor `/imkers/:id`, `/observaties`
- [ ] **SEO Best Practices**: Semantische HTML en meta-tags

---

## 🧪 FASE 6: Testen & Projectoverdracht

### 15. Functionaliteit Testen

- [ ] **Gebruikersflows**: Registreer → Login → Bijenstand → Kast → Observatie
- [ ] **Beheerder Scenario**: Alle gebruikers en data inzien
- [ ] **Imker Scenario**: Alleen eigen data toegankelijk
- [ ] **Anonieme Bezoeker**: Homepage en observaties lijst
- [ ] **Foutscenario's**: 404 pagina's en rechten fouten

### 16. Overdracht aan Frontend Specialist

- [ ] **Component Inventaris**: Lijst van alle gebruikte Radix componenten
- [ ] **CSS Structuur**: Consistente class names en ID's documenteren
- [ ] **Functionaliteit Verificatie**: Alles werkt zonder styling
- [ ] **Ontwikkelaarsdocumentatie**: Technische handleiding voor styling fase

---

## 🛠️ Ontwikkeling Best Practices

### 📦 Component Strategie

- **Server Components**: Standaard keuze voor optimale prestaties
- **Client Components**: Minimaal gebruik (`'use client'` spaarzaam)
- **Formulieren**: Client-side voor interactiviteit, server actions voor logica

### 📡 API Response Structuur

```typescript
{
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}
```

### 🎯 Eindresultaat

Een volledig functionele bijenstandbeheer applicatie met robuuste backend, gebruikersvriendelijke interface en professionele codebase, klaar voor styling door een frontend specialist!

TODO

- [] bespreken met docent, deployment voor klant met eigen account enz.
