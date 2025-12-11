import Image from "next/image";
import { ReactNode } from "react";

interface ContentBlockProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  children?: ReactNode;
}

export function ContentBlock({
  title,
  description,
  image,
  imageAlt,
  reverse = false,
  children,
}: ContentBlockProps) {
  return (
    <div className={`content-block ${reverse ? "content-block--reverse" : ""}`}>
      <div className="content-block__text">
        <h2 className="content-block__title">{title}</h2>
        <p className="content-block__description">{description}</p>
        {children}
      </div>
      <div>
        <Image
          src={image}
          alt={imageAlt}
          width={800}
          height={1000}
          className="content-block__image"
        />
      </div>
    </div>
  );
}
