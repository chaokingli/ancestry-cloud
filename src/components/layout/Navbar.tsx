"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/lib/constants/navigation";

/**
 * Navbar Component
 * Bottom navigation bar for mobile/tablet devices
 * Provides persistent navigation access on smaller screens
 */
export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Show only first 5 items on mobile to prevent overcrowding
  const mobileNavItems = mainNavItems.slice(0, 5);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink-200 bg-paper-100/98 shadow-ink-lg md:hidden"
      role="navigation"
      aria-label="底部导航"
    >
      {/* Top decorative line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-ink-300 to-transparent" />

      <div className="flex items-center justify-around px-2 py-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group flex flex-col items-center gap-1 rounded-md px-3 py-2
                transition-all duration-200 min-w-[3.5rem]
                ${
                  active
                    ? "text-vermilion-600"
                    : "text-ink-500 hover:text-ink-700"
                }
              `}
              aria-current={active ? "page" : undefined}
              title={item.description}
            >
              {/* Icon container */}
              <div
                className={`
                  relative flex h-6 w-6 items-center justify-center
                  transition-transform duration-200 group-hover:scale-110
                `}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "stroke-[2.5px]" : ""}`}
                  aria-hidden="true"
                />

                {/* Active dot indicator */}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-vermilion-600" />
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  font-serif text-xs tracking-wide
                  ${active ? "font-medium" : ""}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area padding for iOS devices */}
      <div className="h-safe-area-inset-bottom bg-paper-100" />
    </nav>
  );
}

/**
 * Desktop Navbar Component
 * Horizontal navigation bar for desktop screens
 * Alternative to Header navigation for certain layouts
 */
export function DesktopNavbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="hidden w-full border-b border-ink-200 bg-paper-100 py-3 md:block"
      role="navigation"
      aria-label="桌面导航"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group relative flex items-center gap-2 rounded-full px-5 py-2.5
                font-serif text-sm tracking-wide transition-all duration-200
                ${
                  active
                    ? "bg-ink-800 text-paper-100 shadow-ink"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-800"
                }
              `}
              aria-current={active ? "page" : undefined}
              title={item.description}
            >
              <Icon
                className={`
                  h-4 w-4 transition-transform duration-200 group-hover:scale-110
                  ${active ? "text-vermilion-300" : ""}
                `}
                aria-hidden="true"
              />
              <span>{item.label}</span>

              {/* Hover indicator for non-active items */}
              {!active && (
                <span
                  className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-vermilion-600 transition-all duration-300 group-hover:w-6"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
