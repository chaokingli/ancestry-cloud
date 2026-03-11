import Link from "next/link";
import { HelpCircle, BookOpen, Users, Mail } from "lucide-react";

export const metadata = {
  title: "使用帮助 - 祖祀",
  description: "祖祀平台使用帮助，了解如何管理家族、祭拜先祖、撰写祭文",
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border-2 border-vermilion-600 bg-vermilion-50">
            <HelpCircle className="h-8 w-8 text-vermilion-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-ink-900">
            使用帮助
          </h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-vermilion-600 to-transparent" />
          <p className="mt-4 font-serif text-ink-600">
            了解如何使用祖祀平台的各项功能
          </p>
        </header>

        {/* Help Sections */}
        <div className="space-y-8">
          <section className="card-ink-elevated p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-ink-100">
                <Users className="h-5 w-5 text-ink-700" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-ink-800">
                家族管理
              </h2>
            </div>
            <ul className="space-y-2 font-serif text-ink-600">
              <li>• 创建家族：点击「我的家族」页面，填写家族名称和简介</li>
              <li>• 邀请成员：进入家族详情页，生成邀请链接分享给家人</li>
              <li>• 权限设置：管理员可设置成员为编辑者或查看者</li>
            </ul>
          </section>

          <section className="card-ink-elevated p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-ink-100">
                <BookOpen className="h-5 w-5 text-ink-700" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-ink-800">
                先祖管理
              </h2>
            </div>
            <ul className="space-y-2 font-serif text-ink-600">
              <li>• 添加先祖：进入「先祖」页面，填写姓名、生卒日期等信息</li>
              <li>• 上传照片：为先祖创建相册，保存珍贵影像</li>
              <li>• 撰写生平：记录先祖的生平事迹和家族贡献</li>
            </ul>
          </section>

          <section className="card-ink-elevated p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-vermilion-100">
                <Mail className="h-5 w-5 text-vermilion-600" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-ink-800">
                联系我们
              </h2>
            </div>
            <p className="font-serif text-ink-600">
              如有其他问题，请联系我们：
              <a href="mailto:contact@zusi.example.com" className="ml-2 text-vermilion-600 hover:underline">
                contact@zusi.example.com
              </a>
            </p>
          </section>
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