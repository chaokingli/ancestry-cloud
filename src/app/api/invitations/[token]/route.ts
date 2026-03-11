import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/invitations/[token] - Validate invitation token
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { message: "邀请令牌是必需的" },
        { status: 400 }
      )
    }

    // Find invitation by token
    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
      },
      include: {
        family: {
          select: {
            id: true,
            name: true,
          },
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!invitation) {
      return NextResponse.json(
        { message: "邀请令牌不存在" },
        { status: 404 }
      )
    }

    // Check if invitation has expired
    const now = new Date()
    if (invitation.expiresAt < now) {
      return NextResponse.json(
        { message: "邀请令牌已过期" },
        { status: 410 }
      )
    }

    // Check if invitation has already been claimed
    if (invitation.status !== "pending") {
      return NextResponse.json(
        { message: "邀请令牌已被使用" },
        { status: 410 }
      )
    }

    return NextResponse.json(
      {
        message: "邀请令牌有效",
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          family: invitation.family,
          inviter: invitation.inviter,
          sentAt: invitation.sentAt,
          expiresAt: invitation.expiresAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[GET /api/invitations/[token]] Error:", error)
    return NextResponse.json(
      { message: "验证邀请令牌失败" },
      { status: 500 }
    )
  }
}