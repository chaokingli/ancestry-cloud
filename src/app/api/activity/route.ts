import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Helper function to check if user is a family member
async function checkFamilyMembership(userId: string, familyId: string) {
  const familyMember = await prisma.familyMember.findFirst({
    where: {
      userId,
      familyId,
    },
  })
  return familyMember
}

// GET /api/activity - Get activity feed for a family
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
    const type = searchParams.get("type")
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
    const familyMember = await checkFamilyMembership(session.user.id, familyId)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    // Build where clause
    const where: {
      familyId: string
      type?: string
    } = {
      familyId,
    }

    // Add type filter if provided
    if (type) {
      where.type = type
    }

    // Get total count for pagination
    const total = await prisma.activity.count({ where })

    // Get activities with pagination and relations
    const activities = await prisma.activity.findMany({
      where,
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
        ancestor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        family: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        activities,
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
    console.error("[GET /api/activity] Error:", error)
    return NextResponse.json(
      { message: "获取活动动态失败" },
      { status: 500 }
    )
  }
}
