import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function EmptyState({
  title,
  description,
  buttonText,
  buttonHref,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h2 className="feature-card__title">{title}</h2>
      <p className="feature-card__text">{description}</p>
      <Link href={buttonHref} className="btn btn--secondary btn--large">
        {buttonText}
      </Link>
    </div>
  );
}
