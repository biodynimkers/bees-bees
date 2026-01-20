'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import {
  User,
  MapPin,
  Box,
  Eye,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
} from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/platform', label: 'Platform' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav__container">
          <Link href="/" className="nav__logo">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="nav__logo-image"
            />
            <span className="nav__logo-text">Biodynamische Imkers Vlaanderen</span>
          </Link>

          <button
            className={`nav__hamburger ${
              isMobileMenuOpen ? 'nav__hamburger--open' : ''
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="nav__hamburger-line"></span>
            <span className="nav__hamburger-line"></span>
            <span className="nav__hamburger-line"></span>
          </button>

          <div className="nav__menu">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav__link ${
                  pathname === item.href ? 'nav__link--active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}

            {session?.user ? (
              <div className="nav__dropdown" ref={dropdownRef}>
                <button
                  className="nav__user-toggle"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="User menu"
                >
                  <span className="nav__user-greeting">Hello</span>
                  <span className="nav__user-name">
                    {session.user.name?.split(' ')[0] ||
                      session.user.email?.split('@')[0] ||
                      'User'}
                    {session.user.role === 'SUPERADMIN'
                      ? ' (superadmin)'
                      : session.user.role === 'ADMIN'
                      ? ' (admin)'
                      : ''}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`nav__user-chevron ${
                      isDropdownOpen ? 'nav__user-chevron--open' : ''
                    }`}
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="nav__dropdown-menu">
                    <Link
                      href="/account"
                      className="nav__dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} />
                      <span>Overzicht</span>
                    </Link>
                    <Link
                      href="/apiaries"
                      className="nav__dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <MapPin size={16} />
                      <span>Bijenstanden</span>
                    </Link>
                    <Link
                      href="/hives"
                      className="nav__dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Box size={16} />
                      <span>Behuizingen</span>
                    </Link>
                    <Link
                      href="/observations"
                      className="nav__dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Eye size={16} />
                      <span>Waarnemingen</span>
                    </Link>
                    {(session.user.role === 'ADMIN' ||
                      session.user.role === 'SUPERADMIN') && (
                      <>
                        <div className="nav__dropdown-divider"></div>
                        <div className="nav__dropdown-section-title">
                          Admin functies
                        </div>
                        <Link
                          href="/admin"
                          className="nav__dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <LayoutDashboard size={16} />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/admin/stats"
                          className="nav__dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <BarChart3 size={16} />
                          <span>Statistieken</span>
                        </Link>
                        <Link
                          href="/admin/users"
                          className="nav__dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Users size={16} />
                          <span>Alle gebruikers</span>
                        </Link>
                        <Link
                          href="/admin/apiaries"
                          className="nav__dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <MapPin size={16} />
                          <span>Alle bijenstanden</span>
                        </Link>
                        <Link
                          href="/admin/hives"
                          className="nav__dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Box size={16} />
                          <span>Alle behuizingen</span>
                        </Link>
                        <Link
                          href="/admin/observations"
                          className="nav__dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Eye size={16} />
                          <span>Alle waarnemingen</span>
                        </Link>
                      </>
                    )}
                    {session?.user?.role === 'SUPERADMIN' && (
                      <>
                        <div className="nav__dropdown-divider"></div>
                        <Link
                          href="/admin/extras"
                          className="nav__dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings size={16} />
                          <span>Extras</span>
                        </Link>
                      </>
                    )}
                    <div className="nav__dropdown-divider"></div>
                    <button
                      onClick={handleLogout}
                      className="nav__dropdown-item"
                    >
                      <LogOut size={16} />
                      <span>Uitloggen</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="nav__link">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <div
        className={`nav__mobile-overlay ${
          isMobileMenuOpen ? 'nav__mobile-overlay--open' : ''
        }`}
        onClick={closeMobileMenu}
      ></div>

      <div
        className={`nav__mobile-menu ${
          isMobileMenuOpen ? 'nav__mobile-menu--open' : ''
        }`}
      >
        <div className="nav__mobile-links">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav__mobile-link ${
                pathname === item.href ? 'nav__mobile-link--active' : ''
              }`}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}

          {session?.user ? (
            <>
              <div className="nav__mobile-divider"></div>
              <Link
                href="/account"
                className="nav__mobile-link"
                onClick={closeMobileMenu}
              >
                <User size={16} />
                <span>Overzicht</span>
              </Link>
              <Link
                href="/apiaries"
                className="nav__mobile-link"
                onClick={closeMobileMenu}
              >
                <MapPin size={16} />
                <span>Bijenstanden</span>
              </Link>
              <Link
                href="/hives"
                className="nav__mobile-link"
                onClick={closeMobileMenu}
              >
                <Box size={16} />
                <span>Behuizingen</span>
              </Link>
              <Link
                href="/observations"
                className="nav__mobile-link"
                onClick={closeMobileMenu}
              >
                <Eye size={16} />
                <span>Waarnemingen</span>
              </Link>
              {(session.user.role === 'ADMIN' ||
                session.user.role === 'SUPERADMIN') && (
                <>
                  <div className="nav__mobile-divider"></div>
                  <div className="nav__mobile-section-title">
                    Admin functies
                  </div>
                  <Link
                    href="/admin"
                    className="nav__mobile-link"
                    onClick={closeMobileMenu}
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/admin/stats"
                    className="nav__mobile-link"
                    onClick={closeMobileMenu}
                  >
                    <BarChart3 size={16} />
                    <span>Statistieken</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className="nav__mobile-link"
                    onClick={closeMobileMenu}
                  >
                    <Users size={16} />
                    <span>Alle gebruikers</span>
                  </Link>
                  <Link
                    href="/admin/apiaries"
                    className="nav__mobile-link"
                    onClick={closeMobileMenu}
                  >
                    <MapPin size={16} />
                    <span>Alle bijenstanden</span>
                  </Link>
                  <Link
                    href="/admin/hives"
                    className="nav__mobile-link"
                    onClick={closeMobileMenu}
                  >
                    <Box size={16} />
                    <span>Alle behuizingen</span>
                  </Link>
                  <Link
                    href="/admin/observations"
                    className="nav__mobile-link"
                    onClick={closeMobileMenu}
                  >
                    <Eye size={16} />
                    <span>Alle waarnemingen</span>
                  </Link>
                </>
              )}
              {session?.user?.role === 'SUPERADMIN' && (
                <>
                  <div className="nav__mobile-divider"></div>
                  <Link
                    href="/admin/extras"
                    className="nav__mobile-link"
                    onClick={closeMobileMenu}
                  >
                    <Settings size={16} />
                    <span>Extras</span>
                  </Link>
                </>
              )}
              <div className="nav__mobile-divider"></div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="nav__mobile-link"
              >
                <LogOut size={16} />
                <span>Uitloggen</span>
              </button>
            </>
          ) : (
            <>
              <div className="nav__mobile-divider"></div>
              <Link
                href="/auth/login"
                className="nav__mobile-link"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
