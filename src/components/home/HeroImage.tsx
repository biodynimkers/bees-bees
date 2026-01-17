'use client';

import { useState } from 'react';

type HeroImageProps = {
  imageUrl: string;
  altText: string;
};

export default function HeroImage({ imageUrl, altText }: HeroImageProps) {
  const [imageSrc, setImageSrc] = useState(imageUrl);

  return (
    <div className="hero__image-wrapper">
      <img
        src={imageSrc}
        alt={altText}
        className="hero__image"
        onError={(e) => {
          e.currentTarget.src = '/assets/hero-new.jpg';
          setImageSrc('/assets/hero-new.jpg');
        }}
      />
    </div>
  );
}
