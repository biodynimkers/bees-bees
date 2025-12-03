"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "Over Ons" },
    { href: "/auth/register", label: "Login" },
  ];

  return (
    <div className="header__container">
      <div className="logo">
        <Link href="/" className="logo__link">
          <Image
            src="/assets/logo.png"
            alt="Bees Logo"
            width={120}
            height={40}
            className="logo__image"
          />
        </Link>
      </div>{" "}
      <nav className="navigation">
        <ul className="navigation__list">
          {navItems.map((item) => (
            <li key={item.href} className="navigation__item">
              <Link
                href={item.href}
                className={`navigation__link ${
                  pathname === item.href ? "navigation__link--active" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
