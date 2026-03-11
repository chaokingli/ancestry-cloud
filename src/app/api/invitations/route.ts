import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

// POST /api/invitations - Create a new invitation
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "未授权，请先登录" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { familyId, email, role } = body

    // Validate required fields
    if (!familyId || !email || !role) {
      return NextResponse.json(
        { message: "家族ID、邮箱和角色是必需的" },
        { status: 400 }
      )
    }

    // Validate role is one of the allowed values
    const validRoles = ["ADMIN", "EDITOR", "VIEWER", "USER"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: "无效的角色" },
        { status: 400 }
      )
    }

    // Check if user is authenticated to this family
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        userId: session.user.id,
        familyId,
      },
    })

    // Check if user is ADMIN (only ADMIN can invite)
    if (!familyMember || familyMember.role !== "ADMIN") {
      return NextResponse.json(
        { message: "只有家族管理员可以邀请成员" },
        { status: 403 }
      )
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        familyId,
        email,
        status: "pending",
      },
    })

    if (existingInvitation) {
      return NextResponse.json(
        { message: "该邮箱已存在未使用的邀请" },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    // Create the invitation
    const invitation = await prisma.invitation.create({
      data: {
        familyId,
        email,
        role,
        token,
        status: "pending",
        expiresAt,
        inviterId: session.user.id,
      },
    })

    // Log invitation (development mode - no email sending implemented yet)
    console.log(`[INVITATION] Email: ${email}, Token: ${token}, Expires: ${expiresAt.toISOString()}`)

    return NextResponse.json(
      { 
        message: "邀请发送成功",
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          sentAt: invitation.sentAt,
          expiresAt: invitation.expiresAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/invitations] Error:", error)
    return NextResponse.json(
      { message: "发送邀请失败" },
      { status: 500 }
    )
  }
}
