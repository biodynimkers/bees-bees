import Link from 'next/link';

interface AdminCardProps {
  href: string;
  title: string;
  description: string;
}

export default function AdminCard({ href, title, description }: AdminCardProps) {
  return (
    <Link href={href} className="feature-card">
      <h3 className="admin-card__title">{title}</h3>
      <p className="admin-card__description">{description}</p>
    </Link>
  );
}
