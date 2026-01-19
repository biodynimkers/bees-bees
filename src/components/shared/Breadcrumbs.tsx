import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs">
      <div className="container">
        <ol className="breadcrumbs__list">
          {items.map((item, index) => (
            <li key={index} className="breadcrumbs__item">
              {item.href && index !== items.length - 1 ? (
                <Link href={item.href} className="breadcrumbs__link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumbs__current">{item.label}</span>
              )}
              {index < items.length - 1 && (
                <span className="breadcrumbs__separator">/</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
