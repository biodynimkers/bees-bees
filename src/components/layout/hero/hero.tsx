import Image from "next/image";
import { ReactNode } from "react";

interface HeroProps {
  title: string;
  subtitle?: string;
  text?: string;
  image: string;
  imageAlt: string;
  children?: ReactNode;
}

export function Hero({
  title,
  subtitle,
  text,
  image,
  imageAlt,
  children,
}: HeroProps) {
  return (
    <section className="hero">
      <div className="hero__image-wrapper">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="hero__image"
          priority
          quality={90}
          sizes="50vw"
        />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        {subtitle && <p className="hero__subtitle">{subtitle}</p>}
        {text && <p className="hero__text">{text}</p>}
        {children}
      </div>
    </section>
  );
}
