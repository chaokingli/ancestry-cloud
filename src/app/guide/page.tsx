import Link from "next/link";
import { ScrollText, Flame, Heart, Calendar } from "lucide-react";

export const metadata = {
  title: "祭祀指南 - 祖祀",
  description: "传统祭祀礼仪指南，了解正确的祭祀方式和注意事项",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50">
            <ScrollText className="h-8 w-8 text-vermilion-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-ink-900">
            祭祀指南
          </h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-vermilion-600 to-transparent" />
          <p className="mt-4 font-serif text-ink-600">
            传承千年祭祀文化，缅怀先祖恩德
          </p>
        </header>

        {/* Guide Content */}
        <div className="space-y-8">
          <section className="card-ink-elevated p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-vermilion-100">
                <Calendar className="h-5 w-5 text-vermilion-600" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-ink-800">
                祭祀时间
              </h2>
            </div>
            <ul className="space-y-2 font-serif text-ink-600">
              <li>• 清明节：扫墓祭祖，表达哀思</li>
              <li>• 中元节：盂兰盆会，超度先灵</li>
              <li>• 寒衣节：送寒衣，寄思念</li>
              <li>• 先祖忌日：家族祭祀，传承孝道</li>
            </ul>
          </section>

          <section className="card-ink-elevated p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-ink-100">
                <Flame className="h-5 w-5 text-ink-700" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-ink-800">
                祭祀方式
              </h2>
            </div>
            <ul className="space-y-2 font-serif text-ink-600">
              <li>• 上香：三炷清香，寓意天地人三才</li>
              <li>• 供奉：水果、糕点、茶酒等供品</li>
              <li>• 跪拜：磕头或作揖，表达敬意</li>
              <li>• 烧纸：金银纸钱，寄托哀思</li>
            </ul>
          </section>

          <section className="card-ink-elevated p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-ink-100">
                <Heart className="h-5 w-5 text-ink-700" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-ink-800">
                祭祀礼仪
              </h2>
            </div>
            <ul className="space-y-2 font-serif text-ink-600">
              <li>• 着装端庄，心怀敬意</li>
              <li>• 先净手焚香，再行跪拜之礼</li>
              <li>• 祭文需诚恳真挚，表达对先祖的怀念</li>
              <li>• 祭祀完毕，向先祖行告别礼</li>
            </ul>
          </section>
        </div>

        {/* Quote */}
        <blockquote className="mt-12 border-l-4 border-vermilion-600 bg-paper-200/50 p-6 text-center">
          <p className="font-serif text-lg italic text-ink-700">
            祭如在，祭神如神在。
          </p>
          <footer className="mt-2 font-serif text-sm text-ink-500">
            —— 《论语·八佾》
          </footer>
        </blockquote>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link href="/" className="btn-ink-outline inline-flex items-center gap-2">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}