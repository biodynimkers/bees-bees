import SessionWrapper from "@/components/auth/SessionWrapper";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import "@/styles/main.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="header">
          <Navigation />
        </header>
        <SessionWrapper>
          <main>{children}</main>
        </SessionWrapper>
        <footer className="footer">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
