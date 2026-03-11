import Link from "next/link";
import { Flame, Users, TreePine, ScrollText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-ink-400 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-vermilion-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Seal decoration */}
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50 shadow-ink">
              <span className="font-serif text-2xl font-bold text-vermilion-600">
                祀
              </span>
            </div>
          </div>

          <h1 className="mb-4 font-serif text-4xl font-bold tracking-wider text-ink-900 sm:text-5xl lg:text-6xl">
            祖祀
          </h1>

          <p className="mb-2 font-serif text-lg text-ink-600">
            传承千年祭祀文化
          </p>

          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-ink-400 to-transparent" />

          <p className="mx-auto max-w-2xl font-serif text-base leading-relaxed text-ink-500">
            以现代技术守护传统孝道，让祖先祭祀成为连接过去与未来的精神纽带。
            在这里，您可以管理宗族信息、祭拜先祖、撰写祭文，让家族记忆代代相传。
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/families"
              className="btn-ink inline-flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span>开始祭祀</span>
            </Link>
            <Link
              href="/guide"
              className="btn-ink-outline inline-flex items-center gap-2"
            >
              <ScrollText className="h-4 w-4" />
              <span>了解祭祀礼仪</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent" />
      </div>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-2xl font-semibold tracking-wider text-ink-800">
              平台功能
            </h2>
            <div className="mx-auto h-px w-16 bg-vermilion-600" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1: Family Management */}
            <div className="card-ink-elevated group p-6 transition-all duration-300 hover:shadow-ink-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-ink-100 text-ink-700 transition-colors group-hover:bg-vermilion-100 group-hover:text-vermilion-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-ink-800">
                宗族管理
              </h3>
              <p className="font-serif text-sm leading-relaxed text-ink-500">
                记录家族谱系，管理宗族成员信息，让家族传承井然有序。
              </p>
            </div>

            {/* Feature 2: Ancestor Records */}
            <div className="card-ink-elevated group p-6 transition-all duration-300 hover:shadow-ink-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-ink-100 text-ink-700 transition-colors group-hover:bg-vermilion-100 group-hover:text-vermilion-600">
                <TreePine className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-ink-800">
                先祖谱系
              </h3>
              <p className="font-serif text-sm leading-relaxed text-ink-500">
                追溯家族根源，查看历代先祖信息，了解自己的血脉传承。
              </p>
            </div>

            {/* Feature 3: Worship Ceremonies */}
            <div className="card-ink-elevated group p-6 transition-all duration-300 hover:shadow-ink-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-ink-100 text-ink-700 transition-colors group-hover:bg-vermilion-100 group-hover:text-vermilion-600">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-ink-800">
                在线祭祀
              </h3>
              <p className="font-serif text-sm leading-relaxed text-ink-500">
                随时随地祭拜先祖，献上香烛、供品，表达孝心与思念。
              </p>
            </div>

            {/* Feature 4: Eulogy Writing */}
            <div className="card-ink-elevated group p-6 transition-all duration-300 hover:shadow-ink-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-ink-100 text-ink-700 transition-colors group-hover:bg-vermilion-100 group-hover:text-vermilion-600">
                <ScrollText className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-ink-800">
                祭文撰写
              </h3>
              <p className="font-serif text-sm leading-relaxed text-ink-500">
                记录对先祖的缅怀之情，撰写祭文、悼词，传承家族记忆。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-paper-200/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="relative">
            <span
              className="absolute -left-4 -top-4 font-serif text-6xl text-ink-200"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="relative z-10 font-serif text-xl leading-relaxed italic text-ink-700 sm:text-2xl">
              慎终追远，民德归厚矣。
            </p>
            <footer className="mt-4 font-serif text-sm text-ink-500">
              —— 《论语·学而》
            </footer>
          </blockquote>

          <div className="mt-8">
            <p className="font-serif text-base text-ink-600">
              祭祀不仅是形式，更是孝道的传承与家族精神的延续。
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-serif text-2xl font-semibold tracking-wider text-ink-800">
            开始您的祭祀之旅
          </h2>
          <p className="mb-8 font-serif text-ink-500">
            创建或加入家族，开启数字化祭祀体验
          </p>
          <Link href="/families" className="btn-vermilion inline-flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span>立即开始</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
