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

// GET /api/ancestors/[id] - Get a single ancestor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "未授权，请先登录" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get ancestor with family info
    const ancestor = await prisma.ancestor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            photos: true,
            eulogies: true,
            worshipRecords: true,
          },
        },
      },
    })

    if (!ancestor) {
      return NextResponse.json(
        { message: "先祖不存在" },
        { status: 404 }
      )
    }

    // Check if user is a member of this family
    const familyMember = await checkFamilyMembership(
      session.user.id,
      ancestor.familyId
    )

    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { ancestor },
      { status: 200 }
    )
  } catch (error) {
    console.error("[GET /api/ancestors/[id]] Error:", error)
    return NextResponse.json(
      { message: "获取先祖信息失败" },
      { status: 500 }
    )
  }
}
