import Section from "@/components/shared/Section";
import SectionHeader from "@/components/shared/SectionHeader";
import SectionContent from "@/components/shared/SectionContent";

export default function VisionPage() {
  return (
    <>
      <Section variant="alternate" first>
        <div className="container">
          <div className="grid grid-two-columns items-center gap-extra-large">
            <div>
              <span className="number-large">
                2009
              </span>
              <div className="quote quote--borderless">
                "Het bijenvolk was spiegel voor de werking"
              </div>
            </div>
            
            <div>
              <h1 className="heading-primary">
                Biodynamische Imkerij Vlaanderen - Van Passie tot Vereniging
              </h1>
              <p className="text-large margin-bottom-small">
                Een kleine groep imkers vindt elkaar rond het werk van Rudolf Steiner. 
                Zijn voordrachtcyclus "De Bijen" wordt hun kompas.
              </p>
              <p className="text-large">
                Maandelijkse bijeenkomsten bij elkaar thuis. Elke sessie start met 
                dezelfde tekst van Steiner – een ritueel dat vandaag nog bestaat.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="container">
          <SectionHeader>
            <h2 className="heading-secondary">Van pioniers naar professionals</h2>
          </SectionHeader>

          <SectionContent grid="three">
            <div className="card text-center">
              <span className="number-large">
                2009
              </span>
              <h3 className="heading-tertiary">
                Eerste cursus
              </h3>
              <p className="card__text">
                Nederlandse experts Albert Muller en Wim Grasstek leggen de 
                basis. Hun begeestering werkt aanstekelijk.
              </p>
            </div>

            <div className="card text-center">
              <span className="number-large">
                2013
              </span>
              <h3 className="heading-tertiary">
                Eigen lesgevers
              </h3>
              <p className="card__text">
                Lutgart Teuwen en Roger Wynants voltooien de lerarenopleiding. 
                Vlaanderen krijgt eigen stemmen.
              </p>
            </div>

            <div className="card text-center">
              <span className="number-large">
                2025
              </span>
              <h3 className="heading-tertiary">
                Officiële VZW
              </h3>
              <p className="card__text">
                Van organische beweging naar gestructureerde organisatie. 
                Barend Weyens haalt meesteropleiding.
              </p>
            </div>
          </SectionContent>
        </div>
      </Section>



      <Section variant="alternate">
        <div className="container">
          <SectionHeader>
            <h2 className="heading-secondary">Wat doet de vereniging?</h2>
            <p className="section-subtitle">
              Vanuit de VZW wordt veel centraal gecoördineerd
            </p>
          </SectionHeader>

          <SectionContent grid="two">
            <div className="feature-card feature-card--01">
            
              <h3 className="heading-tertiary">Opleidingen & Workshops</h3>
              <p className="feature-card__text">
                Van basiscursussen tot verdiepende opleidingen. Ook workshops
                zoals korfvlechten, waskaarsen trekken en lezingen van
                buitenlandse sprekers.
              </p>
            </div>

            <div className="feature-card feature-card--02">
             
              <h3 className="heading-tertiary">Netwerk & Begeleiding</h3>
              <p className="feature-card__text">
                BD-Bee Buddies bieden ondersteuning aan imkers. Regionale
                leesgroepen en een jaarlijks Midwinterevent versterken de
                gemeenschap.
              </p>
            </div>

            <div className="feature-card feature-card--03">
          
              <h3 className="heading-tertiary">Informatieplatform</h3>
              <p className="feature-card__text">
                Website met ledengroep, zwermlijsten en digitale tools om het
                bijenhouden overzichtelijk bij te houden.
              </p>
            </div>

            <div className="feature-card feature-card--04">
         
              <h3 className="heading-tertiary">Samenwerking & Dialoog</h3>
              <p className="feature-card__text">
                Werking naar kinderen en scholen, samenwerking met biodynamische
                landbouwers en dialoog met wetenschappers en natuurbeschermers.
              </p>
            </div>
          </SectionContent>
        </div>
      </Section>

      <Section>
        <div className="container">
          <div className="grid grid-two-columns items-center gap-extra-large">
            <div>
              <span className="number-large">
                30+
              </span>
              <p className="text-xlarge margin-bottom-medium">
                Imkeren naar de aard en het wezen van de bij
              </p>
              <p className="text-xlarge margin-bottom-medium">
                Respect voor de honingbij als levend organisme. Zo min mogelijk 
                ingrijpen op haar natuurlijke levenswijze.
              </p>
              <div className="quote">
                Holistische bijenteelt die gezondheid, welzijn en biodiversiteit 
                centraal stelt.
              </div>
            </div>

            <div className="info-box">
              <h2 className="heading-secondary">
                BD-Bee Buddies
              </h2>
              <p className="info-box__text">
                De praktijk blijft verrassen. Vragen en onzekerheden blijven 
                komen, hoe goed opgeleid je ook bent.
              </p>
              <p className="info-box__text info-box__text--emphasis">
                Daarom begeleiden ervaren imkers nieuwkomers via het 
                BD-Bee Buddies programma.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
