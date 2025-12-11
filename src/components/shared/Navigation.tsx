"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { User, MapPin, Box, Eye, LogOut, Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/vision", label: "Visie" },
    { href: "/platform", label: "Platform" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          Voor Imkers
        </Link>

        <nav className="nav">
          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href ? "nav-link active" : "nav-link"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          {session?.user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="avatar"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="User menu"
              >
                <span className="avatar-circle"></span>
              </button>

              {isDropdownOpen && (
                <div className="dropdown">
                  <Link
                    href="/account"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>Overzicht</span>
                  </Link>
                  <Link
                    href="/apiaries"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <MapPin size={16} />
                    <span>Bijenstanden</span>
                  </Link>
                  <Link
                    href="/hives"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Box size={16} />
                    <span>Kasten</span>
                  </Link>
                  <Link
                    href="/observations"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Eye size={16} />
                    <span>Observaties</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item danger"
                  >
                    <LogOut size={16} />
                    <span>Uitloggen</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="nav-link">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
