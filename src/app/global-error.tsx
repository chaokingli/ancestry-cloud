"use client";

import Link from "next/link";
import { Flame, TreePine, ArrowLeft, Heart, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-paper-100 font-ink">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-ink-400 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-vermilion-400 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
          {/* Seal decoration */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50 shadow-ink">
              <Flame className="h-12 w-12 text-vermilion-600" />
            </div>
          </div>

          <h1 className="mb-4 font-serif text-6xl font-bold tracking-wider text-ink-900 sm:text-7xl lg:text-8xl">
            系统错误
          </h1>

          <div className="mx-auto mb-8 h-px w-40 bg-gradient-to-r from-transparent via-ink-400 to-transparent" />

          <p className="mx-auto mb-6 max-w-lg font-serif text-xl leading-relaxed text-ink-600">
            抱歉，系统出现严重问题。请稍后重试或联系管理员。
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="mb-10 w-full max-w-md rounded border border-ink-200 bg-ink-50 p-4 text-left">
              <p className="font-serif text-base font-semibold text-ink-800">
                错误信息
              </p>
              <p className="mt-1 font-mono text-sm text-ink-600">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 font-mono text-sm text-ink-600">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={reset}
              className="btn-ink inline-flex items-center gap-2 px-8 py-3"
            >
              <RefreshCw className="h-5 w-5" />
              <span className="text-lg">重新加载</span>
            </button>

            <Link
              href="/"
              className="btn-ink-outline inline-flex items-center gap-2 px-8 py-3"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg">返回主页</span>
            </Link>
          </div>

          {/* Quote */}
          <div className="mx-auto max-w-2xl text-center">
            <blockquote className="relative">
              <span
                className="absolute -left-6 -top-6 font-serif text-9xl text-ink-200"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="relative z-10 font-serif text-2xl italic text-ink-800">
                慎终追远，民德归厚矣。
              </p>
              <footer className="mt-4 font-serif text-base text-ink-600">
                —— 《论语·学而》
              </footer>
            </blockquote>
          </div>

          {/* Bottomセal */}
          <div className="mt-16 inline-flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50">
              <Heart className="h-6 w-6 text-vermilion-600" />
            </div>
          </div>

          <p className="mt-4 font-serif text-sm text-ink-500">
            祀 - 祖先祭祀平台
          </p>
        </div>
      </body>
    </html>
  );
}
