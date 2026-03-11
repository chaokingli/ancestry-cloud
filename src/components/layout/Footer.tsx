"use client";

import Link from "next/link";
import { appMetadata, mainNavItems } from "@/lib/constants/navigation";
import { Heart, Mail, Phone } from "lucide-react";

/**
 * Footer Component
 * Application footer with copyright info and quick links
 * Features ink-wash styling with traditional Chinese aesthetics
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-ink-200 bg-paper-100"
      role="contentinfo"
    >
      {/* Top decorative line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-ink-400 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Seal mark */}
              <div className="flex h-10 w-10 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50">
                <span className="font-serif text-lg font-bold text-vermilion-600">
                  祀
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold tracking-wider text-ink-900">
                  {appMetadata.name}
                </h3>
                <p className="font-serif text-xs text-ink-500">
                  {appMetadata.tagline}
                </p>
              </div>
            </div>

            <p className="font-serif text-sm leading-relaxed text-ink-600">
              {appMetadata.description}，以现代技术传承千年祭祀文化，让孝道精神世代相传。
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <a
                href="mailto:contact@zusi.example.com"
                className="flex items-center gap-2 font-serif text-sm text-ink-500 transition-colors hover:text-ink-700"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>contact@zusi.example.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-ink-800">
              快速链接
            </h4>
            <ul className="space-y-2" role="list">
              {mainNavItems.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 font-serif text-sm text-ink-600 transition-colors hover:text-ink-800"
                  >
                    <span
                      className="h-px w-2 bg-ink-300 transition-all group-hover:w-4 group-hover:bg-vermilion-600"
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-ink-800">
              资源
            </h4>
            <ul className="space-y-2" role="list">
              <li>
                <Link
                  href="/help"
                  className="group flex items-center gap-2 font-serif text-sm text-ink-600 transition-colors hover:text-ink-800"
                >
                  <span
                    className="h-px w-2 bg-ink-300 transition-all group-hover:w-4 group-hover:bg-vermilion-600"
                    aria-hidden="true"
                  />
                  <span>使用帮助</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="group flex items-center gap-2 font-serif text-sm text-ink-600 transition-colors hover:text-ink-800"
                >
                  <span
                    className="h-px w-2 bg-ink-300 transition-all group-hover:w-4 group-hover:bg-vermilion-600"
                    aria-hidden="true"
                  />
                  <span>祭祀指南</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="group flex items-center gap-2 font-serif text-sm text-ink-600 transition-colors hover:text-ink-800"
                >
                  <span
                    className="h-px w-2 bg-ink-300 transition-all group-hover:w-4 group-hover:bg-vermilion-600"
                    aria-hidden="true"
                  />
                  <span>常见问题</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="group flex items-center gap-2 font-serif text-sm text-ink-600 transition-colors hover:text-ink-800"
                >
                  <span
                    className="h-px w-2 bg-ink-300 transition-all group-hover:w-4 group-hover:bg-vermilion-600"
                    aria-hidden="true"
                  />
                  <span>隐私政策</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Traditional Wisdom Quote */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-ink-800">
              祖训
            </h4>
            <blockquote className="relative">
              <span
                className="absolute -left-2 -top-2 font-serif text-3xl text-ink-200"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="font-serif text-sm italic leading-relaxed text-ink-600">
                慎终追远，民德归厚矣。祭祀祖先，不仅是仪式，更是传承孝道、凝聚家族的重要纽带。
              </p>
              <footer className="mt-2 font-serif text-xs text-ink-400">
                —— 《论语·学而》
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
            <p className="font-serif text-xs text-ink-500">
              &copy; {currentYear} {appMetadata.name}。保留所有权利。
            </p>
            <span className="hidden font-serif text-ink-300 sm:inline">|</span>
            <p className="flex items-center gap-1 font-serif text-xs text-ink-500">
              用
              <Heart className="h-3 w-3 text-vermilion-600" aria-hidden="true" />
              传承文化
            </p>
          </div>

          {/* Version */}
          <p className="font-serif text-xs text-ink-400">
            版本 {appMetadata.version}
          </p>

          {/* Traditional Pattern Decoration */}
          <div
            className="hidden items-center gap-1 lg:flex"
            aria-hidden="true"
          >
            <span className="h-px w-8 bg-ink-300" />
            <div className="flex h-4 w-4 items-center justify-center border border-vermilion-600">
              <span className="text-xs text-vermilion-600">祀</span>
            </div>
            <span className="h-px w-8 bg-ink-300" />
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="h-1 w-full bg-gradient-to-r from-ink-900 via-vermilion-700 to-ink-900" />
    </footer>
  );
}

/**
 * Simple Footer Component
 * Minimal footer for secondary pages or embedded views
 */
export function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-ink-200 bg-paper-100 py-4"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 sm:flex-row sm:gap-4">
        <p className="font-serif text-xs text-ink-500">
          &copy; {currentYear} {appMetadata.name}
        </p>
        <span className="hidden text-ink-300 sm:inline">·</span>
        <p className="font-serif text-xs text-ink-400">
          {appMetadata.tagline}
        </p>
      </div>
    </footer>
  );
}
