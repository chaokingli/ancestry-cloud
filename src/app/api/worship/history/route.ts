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

// GET /api/worship/history - Get worship history records
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
    const ancestorId = searchParams.get("ancestorId")
    const familyId = searchParams.get("familyId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const sortBy = searchParams.get("sortBy") || "worshipDate"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Validate required fields - at least one filtering parameter needed
    if (!ancestorId && !familyId) {
      return NextResponse.json(
        { message: "祖先ID或家族ID必须提供一个" },
        { status: 400 }
      )
    }

    // If familyId is provided, check if user is a member
    if (familyId) {
      const familyMember = await checkFamilyMembership(session.user.id, familyId)
      if (!familyMember) {
        return NextResponse.json(
          { message: "您不是该家族的成员" },
          { status: 403 }
        )
      }
    }

    // Build where clause
    const where: {
      ancestorId?: string
      familyId?: string
    } = {}

    if (ancestorId) {
      where.ancestorId = ancestorId
      // If ancestorId is provided, verify the ancestor belongs to a family
      // that the user has access to
      const ancestor = await prisma.ancestor.findFirst({
        where: { id: ancestorId },
      })
      if (!ancestor) {
        return NextResponse.json(
          { message: "祖先记录不存在" },
          { status: 404 }
        )
      }
      // Verify user has access to this ancestor's family
      if (ancestor.familyId) {
        const familyMember = await checkFamilyMembership(session.user.id, ancestor.familyId)
        if (!familyMember) {
          return NextResponse.json(
            { message: "您没有权限查看此祖先的祭拜记录" },
            { status: 403 }
          )
        }
      }
    }

    if (familyId) {
      where.familyId = familyId
    }

    // Get total count for pagination
    const total = await prisma.worshipRecord.count({ where })

    // Get worship records with pagination
    const worshipRecords = await prisma.worshipRecord.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        ancestor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            birthDate: true,
            deathDate: true,
          },
        },
        family: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
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
        worshipRecords,
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
    console.error("[GET /api/worship/history] Error:", error)
    return NextResponse.json(
      { message: "获取祭拜历史记录失败" },
      { status: 500 }
    )
  }
}
