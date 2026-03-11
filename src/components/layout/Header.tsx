"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { appMetadata, mainNavItems, Menu, X } from "@/lib/constants/navigation";

/**
 * Header Component
 * Main application header with ink-wash styling
 * Features responsive design with mobile hamburger menu
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-ink-200/50 bg-paper-100/95 backdrop-blur-sm"
      role="banner"
    >
      {/* Top accent line - ink wash style */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-ink-400 to-transparent" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
          aria-label={`${appMetadata.fullName} - 返回首页`}
        >
          {/* Seal-style logo mark */}
          <div className="flex h-10 w-10 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50 text-vermilion-600 shadow-sm">
            <span className="font-serif text-lg font-bold tracking-widest">
              祀
            </span>
          </div>

          {/* Brand name */}
          <div className="flex flex-col">
            <span className="font-serif text-xl font-semibold tracking-[0.15em] text-ink-900">
              {appMetadata.name}
            </span>
            <span className="hidden text-xs tracking-wider text-ink-500 sm:block">
              {appMetadata.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          role="navigation"
          aria-label="主导航"
        >
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  group relative flex items-center gap-2 rounded-sm px-4 py-2
                  font-serif text-sm tracking-wide transition-all duration-200
                  ${
                    active
                      ? "bg-ink-100 text-ink-900"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-800"
                  }
                `}
                aria-current={active ? "page" : undefined}
                title={item.description}
              >
                <Icon
                  className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                    active ? "text-vermilion-600" : ""
                  }`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>

                {/* Active indicator - vermilion underline */}
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-vermilion-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-ink-200 text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-menu"
        className={`
          border-t border-ink-200 bg-paper-100 md:hidden
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
        `}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="space-y-1 px-4 py-3" role="navigation" aria-label="移动导航">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 rounded-sm px-3 py-3
                  font-serif text-base tracking-wide transition-all duration-200
                  ${
                    active
                      ? "bg-ink-100 text-ink-900"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-800"
                  }
                `}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "text-vermilion-600" : ""}`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
