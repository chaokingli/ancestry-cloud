import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/invitations/[token]/accept - Accept invitation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await auth()
    const { token } = await params

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "未授权，请先登录" },
        { status: 401 }
      )
    }

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
        family: true,
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

    // Verify that the authenticated user's email matches the invitation email
    if (invitation.email !== session.user.email) {
      return NextResponse.json(
        { message: "邀请令牌与当前用户邮箱不匹配" },
        { status: 403 }
      )
    }

    // Check if user is already a member of this family
    const existingMember = await prisma.familyMember.findFirst({
      where: {
        userId: session.user.id,
        familyId: invitation.familyId,
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { message: "您已经是该家族的成员" },
        { status: 400 }
      )
    }

    // Create family membership
    const familyMember = await prisma.familyMember.create({
      data: {
        userId: session.user.id,
        familyId: invitation.familyId,
        role: invitation.role,
      },
    })

    // Update invitation status to claimed
    await prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "claimed",
        claimedAt: new Date(),
      },
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        familyId: invitation.familyId,
        type: "member_invited",
        itemId: familyMember.id,
        itemName: session.user.name || session.user.email,
        description: `邀请 ${session.user.name || session.user.email} 加入家族`,
        userId: invitation.inviterId,
      },
    })

    return NextResponse.json(
      {
        message: "邀请接受成功",
        family: {
          id: invitation.family.id,
          name: invitation.family.name,
        },
        role: familyMember.role,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[POST /api/invitations/[token]/accept] Error:", error)
    return NextResponse.json(
      { message: "接受邀请失败" },
      { status: 500 }
    )
  }
}