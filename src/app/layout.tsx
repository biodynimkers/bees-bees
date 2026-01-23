import SessionWrapper from "@/components/auth/SessionWrapper";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import "@/styles/main.css";
import { Inter, Cormorant_Garamond } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: "Biodynamische Imkers Vlaanderen",
  description:
    "Digitaal imkeren voor de moderne bijhouder. Eenvoudig, overzichtelijk, effectief.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <SessionWrapper>
          <div className="app">
            <Navigation />
            <main className="app__content">{children}</main>
            <Footer />
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
