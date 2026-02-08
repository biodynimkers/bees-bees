'use client';

import ScrollAnimations from '@/components/home/ScrollAnimations';

export default function ContactPage() {
  return (
    <>
      <ScrollAnimations />

      <section className="section section-first">
        <div className="container container--narrow">
          <div className="text-center">
            <h1 className="heading-primary margin-bottom-medium animate-on-scroll">
              Neem contact met ons op
            </h1>

            <p className="text-large margin-bottom-large animate-on-scroll">
              Heeft u vragen over het platform, suggesties voor verbeteringen of
              wilt u graag meer informatie? Wij staan klaar om u te helpen.
            </p>

            <div className="card animate-on-scroll">
              <p className="text-large margin-bottom-small">
                Stuur ons een e-mail en we nemen zo snel mogelijk contact met u
                op
              </p>
              <p className="text-extra-large">
                <a
                  href="mailto:contact@biodynimkers.be"
                  className="color-white"
                >
                  contact@biodynimkers.be
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
