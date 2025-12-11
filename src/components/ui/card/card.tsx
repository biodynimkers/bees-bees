import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "bordered";
  className?: string;
}

const CardComponent = ({
  children,
  variant = "default",
  className = "",
}: CardProps) => {
  const variantClass = `card--${variant}`;
  const classes = ["card", variantClass, className].filter(Boolean).join(" ");

  return <article className={classes}>{children}</article>;
};

export const Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
  Image: CardImage,
  Title: CardTitle,
  Description: CardDescription,
  Link: CardLink,
});

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`card-content ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

function CardFooter({ children, className = "" }: CardFooterProps) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}

interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait";
  className?: string;
}

function CardImage({
  src,
  alt,
  aspectRatio = "video",
  className = "",
}: CardImageProps) {
  const aspectClass = `card-image--${aspectRatio}`;
  const classes = ["card-image", aspectClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="card-image-element"
      />
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

function CardTitle({
  children,
  as: Component = "h3",
  className = "",
}: CardTitleProps) {
  return (
    <Component className={`card-title ${className}`}>{children}</Component>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return <p className={`card-description ${className}`}>{children}</p>;
}

interface CardLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

function CardLink({ href, children, className = "" }: CardLinkProps) {
  return (
    <Link href={href} className={`card-link ${className}`}>
      {children}
    </Link>
  );
}
