import Link from "next/link";
import { HelpCircle } from "lucide-react";

export const metadata = {
  title: "常见问题 - 祖祀",
  description: "祖祀平台常见问题解答",
};

const faqs = [
  {
    question: "如何创建家族？",
    answer: "登录后进入「我的家族」页面，点击「创建家族」按钮，填写家族名称、简介等信息即可创建。",
  },
  {
    question: "如何邀请家人加入家族？",
    answer: "进入家族详情页，点击「邀请成员」，系统会生成邀请链接，分享给家人即可加入。",
  },
  {
    question: "如何为先祖撰写祭文？",
    answer: "进入先祖详情页，选择「撰写祭文」，可使用模板或自由撰写，完成后保存即可。",
  },
  {
    question: "祭祀动画如何使用？",
    answer: "在先祖详情页选择「在线祭祀」，选择上香、供奉、跪拜或烧纸等方式，按提示操作即可。",
  },
  {
    question: "如何设置成员权限？",
    answer: "家族管理员可在成员列表中设置成员权限，包括管理员、编辑者和查看者三种角色。",
  },
  {
    question: "数据安全如何保障？",
    answer: "我们采用加密存储，定期备份，确保您的家族信息安全。详情请查看隐私政策。",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50">
            <HelpCircle className="h-8 w-8 text-vermilion-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-ink-900">
            常见问题
          </h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-vermilion-600 to-transparent" />
          <p className="mt-4 font-serif text-ink-600">
            解答您在使用祖祀平台时的常见疑问
          </p>
        </header>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="card-ink-elevated group p-6"
            >
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-semibold text-ink-800 marker:content-none">
                <span>{faq.question}</span>
                <span className="text-vermilion-600 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 font-serif text-ink-600 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 rounded-lg bg-paper-200/50 p-6 text-center">
          <p className="font-serif text-ink-600">
            还有其他问题？
            <Link href="/help" className="ml-2 text-vermilion-600 hover:underline">
              查看帮助中心
            </Link>
          </p>
        </div>

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