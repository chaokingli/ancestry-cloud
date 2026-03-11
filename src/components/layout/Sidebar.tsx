"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  sidebarNavItems,
  appMetadata,
  Menu,
  X,
} from "@/lib/constants/navigation";

/**
 * Sidebar Component
 * Collapsible sidebar with navigation links for family/ancestor management
 * Features ink-wash styling with traditional Chinese aesthetics
 */
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        type="button"
        className="fixed left-4 top-20 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-paper-100 text-ink-700 shadow-ink transition-all hover:bg-ink-50 hover:text-ink-900 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-expanded={isMobileOpen}
        aria-controls="sidebar-menu"
        aria-label={isMobileOpen ? "关闭侧边栏" : "打开侧边栏"}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar-menu"
        className={`
          fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-ink-200
          bg-paper-100 transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        role="complementary"
        aria-label="侧边导航"
      >
        {/* Decorative top border */}
        <div className="h-[2px] w-full bg-gradient-to-r from-vermilion-600 via-ink-400 to-transparent" />

        <div className="flex h-full flex-col">
          {/* Sidebar Header - Desktop only */}
          <div className="hidden items-center justify-between border-b border-ink-200/50 px-4 py-4 lg:flex">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                {/* Seal mark */}
                <div className="flex h-8 w-8 items-center justify-center border border-vermilion-600 bg-vermilion-50">
                  <span className="font-serif text-sm font-bold text-vermilion-600">
                    祀
                  </span>
                </div>
                <span className="font-serif text-sm font-medium tracking-wider text-ink-700">
                  {appMetadata.name}
                </span>
              </div>
            )}

            {/* Collapse toggle button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`
                flex h-7 w-7 items-center justify-center rounded
                border border-ink-200 text-ink-500 transition-colors
                hover:bg-ink-50 hover:text-ink-700
                ${isCollapsed ? "mx-auto" : ""}
              `}
              aria-label={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
              title={isCollapsed ? "展开" : "收起"}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className="flex-1 space-y-1 px-3 py-4"
            role="navigation"
            aria-label="功能导航"
          >
            {/* Section label - visible when expanded */}
            {!isCollapsed && (
              <div className="mb-2 px-3">
                <span className="font-serif text-xs tracking-wider text-ink-400">
                  主要功能
                </span>
              </div>
            )}

            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    group relative flex items-center gap-3 rounded-md px-3 py-3
                    font-serif text-sm tracking-wide transition-all duration-200
                    ${
                      active
                        ? "bg-ink-100 text-ink-900"
                        : "text-ink-600 hover:bg-ink-50 hover:text-ink-800"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                  aria-current={active ? "page" : undefined}
                  title={item.description}
                >
                  {/* Icon */}
                  <div
                    className={`
                      flex h-8 w-8 items-center justify-center rounded
                      transition-all duration-200
                      ${
                        active
                          ? "bg-vermilion-100 text-vermilion-600"
                          : "bg-ink-50 text-ink-500 group-hover:bg-ink-100 group-hover:text-ink-700"
                      }
                    `}
                  >
                    <Icon
                      className={`h-4 w-4 ${active ? "stroke-[2.5px]" : ""}`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Label - hidden when collapsed */}
                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {/* Active indicator */}
                  {active && !isCollapsed && (
                    <span className="h-1.5 w-1.5 rounded-full bg-vermilion-600" />
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <span
                      className="absolute left-full ml-2 hidden rounded bg-ink-800 px-2 py-1 text-xs text-paper-100 group-hover:block"
                      role="tooltip"
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-ink-200/50 px-3 py-4">
            {!isCollapsed ? (
              <div className="space-y-3">
                {/* Decorative divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-ink-300 to-transparent" />

                {/* Help text */}
                <p className="px-2 text-center font-serif text-xs italic text-ink-400">
                  传承孝道 · 缅怀先祖
                </p>

                {/* Version info */}
                <p className="px-2 text-center font-serif text-[10px] text-ink-300">
                  版本 {appMetadata.version}
                </p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-vermilion-600" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for desktop sidebar */}
      <div
        className={`
          hidden shrink-0 transition-all duration-300 lg:block
          ${isCollapsed ? "w-16" : "w-64"}
        `}
        aria-hidden="true"
      />
    </>
  );
}

/**
 * Sidebar Layout Wrapper
 * Provides a complete sidebar layout with main content area
 */
export function SidebarLayout({
  children,
  showSidebar = true,
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
}) {
  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
