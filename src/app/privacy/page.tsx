import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "隐私政策 - 祖祀",
  description: "祖祀平台隐私政策，了解我们如何保护您的个人信息",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50">
            <Shield className="h-8 w-8 text-vermilion-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-ink-900">
            隐私政策
          </h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-vermilion-600 to-transparent" />
          <p className="mt-4 font-serif text-ink-600">
            更新日期：2024年1月1日
          </p>
        </header>

        {/* Content */}
        <article className="card-ink-elevated space-y-8 p-8">
          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              一、信息收集
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              我们收集您注册时提供的信息（姓名、邮箱、密码），以及您在使用平台时创建的家族、先祖信息、祭文等内容。
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              二、信息使用
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              您的信息仅用于提供平台服务，包括家族管理、祭祀功能、活动记录等。我们不会将您的个人信息用于其他目的。
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              三、信息保护
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              我们采用行业标准的安全措施保护您的数据，包括数据加密、访问控制、定期备份等。您的密码经过加密存储，我们无法获取明文密码。
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              四、信息共享
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              我们不会将您的个人信息出售或共享给第三方，除非获得您的明确同意或法律法规要求。
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              五、您的权利
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              您有权查看、修改、删除您的个人信息。如需行使这些权利，请通过平台设置页面操作或联系我们。
            </p>
          </section>
        </article>

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