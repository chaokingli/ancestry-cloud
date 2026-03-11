import Link from "next/link";
import { TreePine, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
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
            <span className="font-serif text-3xl font-bold text-vermilion-600">404</span>
          </div>
        </div>

        <h1 className="mb-4 font-serif text-5xl font-bold tracking-wider text-ink-900 sm:text-6xl lg:text-7xl">
          页面未找到
        </h1>

        <div className="mx-auto mb-8 h-px w-32 bg-gradient-to-r from-transparent via-ink-400 to-transparent" />

        <p className="mx-auto mb-8 max-w-md font-serif text-lg leading-relaxed text-ink-600">
          您请求的页面不存在或已被移动。请检查网址或返回主页。
        </p>

        {/* Search hint */}
        <div className="mb-10 flex items-center justify-center gap-2 text-ink-500">
          <Search className="h-5 w-5" />
          <span className="font-serif text-base">提示：检查网址拼写或使用搜索功能</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-ink inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回主页</span>
          </Link>

          <Link
            href="/families"
            className="btn-ink-outline inline-flex items-center gap-2"
          >
            <TreePine className="h-4 w-4" />
            <span>查看家族</span>
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="mx-auto mt-16 h-px w-64 bg-gradient-to-r from-transparent via-ink-200 to-transparent" />

        {/* Quote */}
        <div className="mt-10">
          <blockquote className="relative">
            <span
              className="absolute -left-6 -top-6 font-serif text-8xl text-ink-200"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="relative z-10 font-serif text-xl italic text-ink-700">
              观今宜鉴古，无古不成今。
            </p>
            <footer className="mt-4 font-serif text-sm text-ink-500">
              —— 《增广贤文》
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
