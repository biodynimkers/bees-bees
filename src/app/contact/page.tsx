export default function ContactPage() {
  return (
    <section className="section section-first" style={{ background: 'white' }}>
      <div className="container container--narrow">
        <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="heading-primary" style={{ marginBottom: 'var(--space-6)' }}>
            Neem contact met ons op
          </h1>
          
          <p className="text-large" style={{ 
            marginBottom: 'var(--space-8)',
            color: 'var(--color-text-light)',
            lineHeight: '1.8'
          }}>
            Heeft u vragen over het platform, suggesties voor verbeteringen of 
            wilt u graag meer informatie? Wij staan klaar om u te helpen.
          </p>

          <div style={{ 
            padding: 'var(--space-12)',
            background: 'white',
            borderRadius: 'var(--border-radius-lg)',
            marginTop: 'var(--space-12)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <p className="text-large" style={{ marginBottom: 'var(--space-4)' }}>
              Stuur ons een e-mail en we nemen zo snel mogelijk contact met u op
            </p>
            <p className="text-extra-large">
              <a 
                href="mailto:info@bees-platform.be" 
                className="color-accent"
                style={{ fontWeight: '600' }}
              >
                info@bees-platform.be
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
