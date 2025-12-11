import SessionWrapper from "@/components/auth/SessionWrapper";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import "@/styles/main.css";

export const metadata = {
  title: "BEES - Bijen Observatie Platform",
  description:
    "Digitaal imkeren voor de moderne bijhouder. Eenvoudig, overzichtelijk, effectief.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        <SessionWrapper>
          <div className="app">
            <Navigation />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
