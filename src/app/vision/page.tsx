import { Hero, Section } from "@/components/layout";

export default function VisionPage() {
  return (
    <>
      <Hero
        title="Onze Visie"
        subtitle="Bijenhouden voor de moderne imker"
        image="/assets/hero-new.jpg"
        imageAlt="Bijenvolk in de natuur"
      />

      <Section variant="alt" spacing="large">
        <div className="container container-narrow">
          <article>
            <header className="article-header">
              <div className="article-category">Missie</div>
              <h1 className="article-title">
                Digitaal imkeren, zonder complexiteit
              </h1>
              <p className="article-subtitle">
                Wij geloven dat bijenhouden eenvoudig, overzichtelijk en
                toegankelijk moet zijn. Daarom bouwen we tools die imkers écht
                helpen.
              </p>
            </header>

            <div className="article-body">
              <p>
                Het bijenhouden is een ambacht dat eeuwenoud is, maar de moderne
                imker heeft moderne uitdagingen. Van het bijhouden van
                waarnemingen tot het plannen van interventies: veel imkers
                werken nog met papieren logboeken, losse notities en geheugen.
              </p>

              <p className="mb-12">
                Wij zagen een kans om dit anders te doen. Niet door het
                bijenhouden te veranderen, maar door het <em>bijhouden</em> te
                vereenvoudigen. Ons platform is gebouwd met één doel: imkers
                helpen focussen op wat ze het liefste doen – werken met hun
                bijen.
              </p>

              <h2>Voor imkers, door imkers</h2>

              <p>
                Ons team bestaat uit mensen die zelf imkeren of nauw betrokken
                zijn bij de bijenwereld. We weten wat er speelt: te weinig tijd,
                te veel administratie, en de constante wens om beter te worden.
              </p>

              <p>
                Daarom is ons platform geen "one-size-fits-all" oplossing. Het
                is flexibel genoeg voor hobbyimkers met één of twee kasten, maar
                ook krachtig genoeg voor professionals met tientallen
                bijenstanden.
              </p>

              <div className="quote">
                "Technologie moet het ambacht ondersteunen, niet overnemen."
              </div>

              <h2>Waar we voor staan</h2>

              <p className="mb-6">
                <strong>Eenvoud:</strong> Geen overbodige functies of complexe
                workflows. Je registreert wat belangrijk is, wanneer het
                belangrijk is.
              </p>

              <p className="mb-6">
                <strong>Privacy:</strong> Jouw gegevens zijn van jou. We delen
                geen locaties met andere gebruikers en verkopen geen data aan
                derden.
              </p>

              <p className="mb-6">
                <strong>Toegankelijkheid:</strong> Of je nu op je telefoon werkt
                bij de bijenstal of thuis op je computer: het platform werkt
                overaleven goed.
              </p>

              <p className="mb-12">
                <strong>Duurzaamheid:</strong> Door slimmer te werken en beter
                inzicht te krijgen, kunnen imkers effectiever bijenhouden. Dat
                is goed voor de imker, en goed voor de bijen.
              </p>

              <h2>De toekomst</h2>

              <p>
                We zijn nog maar net begonnen. In de toekomst willen we imkers
                nog meer tools bieden: van seizoensanalyses tot
                dracht-voorspellingen op basis van lokale plantengroei. Maar
                altijd met hetzelfde uitgangspunt: technologie die ondersteunt,
                niet overheerst.
              </p>

              <p>
                Want uiteindelijk gaat het niet om het platform – het gaat om de
                bijen, en de mensen die voor ze zorgen.
              </p>
            </div>
          </article>
        </div>
      </Section>
    </>
  );
}
