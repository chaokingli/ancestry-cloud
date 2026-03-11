"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Implement password reset logic
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-paper-50 to-ink-50/30 px-4 py-12">
      <Card className="w-full max-w-md border-ink-200 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-vermilion-600 bg-vermilion-50">
            <KeyRound className="h-8 w-8 text-vermilion-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="font-serif text-2xl text-ink-900">
              忘记密码
            </CardTitle>
            <CardDescription className="text-ink-600">
              输入您的邮箱，我们将发送重置链接
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {submitted ? (
            <div className="rounded-lg bg-vermilion-50 p-6 text-center">
              <p className="font-serif text-ink-700">
                重置链接已发送至您的邮箱，请查收。
              </p>
              <p className="mt-2 font-serif text-sm text-ink-500">
                如未收到，请检查垃圾邮件文件夹。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-serif text-ink-900">
                  邮箱地址
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="font-mono"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-ink-900 font-serif tracking-wide hover:bg-ink-800"
              >
                发送重置链接
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="font-serif text-sm text-vermilion-600 hover:text-vermilion-700"
            >
              返回登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}