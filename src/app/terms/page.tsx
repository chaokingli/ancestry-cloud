import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = {
  title: "服务条款 - 祖祀",
  description: "祖祀平台服务条款",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50">
            <FileText className="h-8 w-8 text-vermilion-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-ink-900">
            服务条款
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
              一、服务说明
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              祖祀平台为用户提供数字化祭祀服务，包括家族管理、先祖信息管理、在线祭祀、祭文撰写等功能。
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              二、用户注册
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              用户需提供真实、准确的信息进行注册。每位用户对其账户下的所有活动负责，请妥善保管账户密码。
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              三、用户行为规范
            </h2>
            <ul className="font-serif leading-relaxed text-ink-600 space-y-2">
              <li>• 不得发布违法、有害、侮辱性内容</li>
              <li>• 不得冒充他人或提供虚假信息</li>
              <li>• 不得干扰平台正常运营</li>
              <li>• 尊重其他用户，维护良好社区氛围</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              四、知识产权
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              平台设计、代码、标识等知识产权归平台所有。用户创建的内容（祭文、照片等）知识产权归用户所有。
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              五、免责声明
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              平台尽力保障服务稳定，但不对因网络、设备等不可抗力造成的服务中断负责。用户数据将定期备份，建议用户自行保存重要内容。
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-800">
              六、条款修改
            </h2>
            <p className="font-serif leading-relaxed text-ink-600">
              我们有权随时修改本条款，修改后的条款将在平台公布。继续使用平台即表示您同意修改后的条款。
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