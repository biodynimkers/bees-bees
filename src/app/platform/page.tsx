import { Hero, Section, ContentBlock } from "@/components/layout";
import { Card, Button } from "@/components/ui";

export default function PlatformPage() {
  return (
    <>
      <Hero
        title="Het Platform"
        subtitle="Alles wat je nodig hebt voor digitaal imkeren"
        image="/assets/hero-new.jpg"
        imageAlt="Bijenhouden met technologie"
      />

      <Section variant="default" spacing="large">
        <div className="container">
          <div className="section-header">
            <h2>Hoe werkt het?</h2>
            <p>
              In vier simpele stappen heb je jouw bijenhouden volledig
              gedigitaliseerd. Geen ingewikkelde setup, geen technische kennis
              vereist.
            </p>
          </div>

          <div className="grid grid-2">
            <Card>
              <Card.Header>
                <Card.Title>1. Maak een account aan</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Registreer gratis in minder dan een minuut. Geen
                  betaalgegevens nodig, geen verplichtingen.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>2. Voeg je bijenstanden toe</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Registreer de locaties van je bijenstanden. Je GPS-locaties
                  blijven volledig privé.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>3. Registreer je kasten</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Koppel kasten aan je standen. Houd bij welke kasten waar staan
                  en wat hun status is.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>4. Log je waarnemingen</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Noteer observaties direct bij je kastcontroles. Foto's,
                  notities, acties – alles op één plek.
                </Card.Description>
              </Card.Content>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
