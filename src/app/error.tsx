"use client";

import Link from "next/link";
import { Flame, RefreshCw, Heart, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-100 px-4 py-16">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-ink-400 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-vermilion-400 blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        {/* Seal decoration */}
        <div className="mb-8 inline-flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50 shadow-ink">
            <Flame className="h-10 w-10 text-vermilion-600" />
          </div>
        </div>

        <h1 className="mb-4 font-serif text-5xl font-bold tracking-wider text-ink-900 sm:text-6xl lg:text-7xl">
          出错了
        </h1>

        <div className="mx-auto mb-6 h-px w-32 bg-gradient-to-r from-transparent via-ink-400 to-transparent" />

        <p className="mx-auto mb-4 max-w-md font-serif text-lg leading-relaxed text-ink-600">
          抱歉，页面出现问题。请稍后重试或返回主页。
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 rounded border border-ink-200 bg-ink-50 p-4 text-left">
            <p className="font-mono text-xs text-ink-500">
              Error: {error.message}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-ink-500">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={reset}
            className="btn-ink inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>重试</span>
          </button>

          <Link
            href="/"
            className="btn-ink-outline inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回主页</span>
          </Link>
        </div>

        {/* Quote */}
        <div className="mt-8">
          <p className="font-serif text-ink-500">
            诚心祭之，虽远必应。
          </p>
          <div className="my-4" />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-vermilion-600 hover:text-vermilion-700"
          >
            <Heart className="h-4 w-4" />
            <span className="font-serif text-sm">点击回到开始</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
