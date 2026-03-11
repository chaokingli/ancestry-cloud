import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT /api/members - Update member role
export async function PUT(request: NextRequest) {
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
    const { memberId, familyId, role } = body

    // Validate required fields
    if (!memberId || !familyId || !role) {
      return NextResponse.json(
        { message: "成员ID、家族ID和角色是必需的" },
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

    // Check if the current user is ADMIN in this family
    const currentUserMember = await prisma.familyMember.findFirst({
      where: {
        userId: session.user.id,
        familyId,
      },
    })

    if (!currentUserMember || currentUserMember.role !== "ADMIN") {
      return NextResponse.json(
        { message: "只有家族管理员可以修改成员权限" },
        { status: 403 }
      )
    }

    // Prevent self-role modification (prevent locking out)
    if (memberId === session.user.id) {
      return NextResponse.json(
        { message: "不能修改自己的角色" },
        { status: 400 }
      )
    }

    // Check if the target member exists in the family
    const targetMember = await prisma.familyMember.findFirst({
      where: {
        id: memberId,
        familyId,
      },
    })

    if (!targetMember) {
      return NextResponse.json(
        { message: "成员不存在" },
        { status: 404 }
      )
    }

    // Update the member's role
    const updatedMember = await prisma.familyMember.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
    })

    return NextResponse.json(
      {
        message: "成员权限更新成功",
        member: {
          id: updatedMember.id,
          userId: updatedMember.userId,
          familyId: updatedMember.familyId,
          role: updatedMember.role,
          createdAt: updatedMember.createdAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[PUT /api/members] Error:", error)
    return NextResponse.json(
      { message: "更新成员权限失败" },
      { status: 500 }
    )
  }
}

// GET /api/members - Get family members
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "未授权，请先登录" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const familyId = searchParams.get("familyId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    // Validate required fields
    if (!familyId) {
      return NextResponse.json(
        { message: "家族ID是必需的" },
        { status: 400 }
      )
    }

    // Check if user is a member of this family
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        userId: session.user.id,
        familyId,
      },
    })

    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    // Get total count for pagination
    const total = await prisma.familyMember.count({
      where: {
        familyId,
      },
    })

    // Get family members with pagination and user details
    const members = await prisma.familyMember.findMany({
      where: {
        familyId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        members,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[GET /api/members] Error:", error)
    return NextResponse.json(
      { message: "获取家族成员列表失败" },
      { status: 500 }
    )
  }
}
