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

// Helper function to check if user is an ADMIN
function isAdmin(role: string): boolean {
  return role === "ADMIN"
}

// GET /api/eulogies/templates - Get all eulogy templates
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

    let templates = []

    if (familyId) {
      // Check if user is a member of this family with ADMIN permission
      const familyMember = await checkFamilyMembership(session.user.id, familyId)
      if (!familyMember) {
        return NextResponse.json(
          { message: "您不是该家族的成员" },
          { status: 403 }
        )
      }

      if (!isAdmin(familyMember.role)) {
        return NextResponse.json(
          { message: "您没有权限查看致词模板" },
          { status: 403 }
        )
      }

      // Get templates for ancestors in this family
      templates = await prisma.eulogy.findMany({
        where: {
          ancestor: {
            familyId,
          },
          isTemplate: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    } else {
      // Get all templates for authenticated user
      templates = await prisma.eulogy.findMany({
        where: {
          isTemplate: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    return NextResponse.json({ templates }, { status: 200 })
  } catch (error) {
    console.error("[GET /api/eulogies/templates] Error:", error)
    return NextResponse.json(
      { message: "获取致词模板列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/eulogies/templates - Create a new eulogy template
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
    const {
      familyId,
      ancestorId,
      templateName,
      content,
    } = body

    // Validate required fields
    if (!templateName || !content) {
      return NextResponse.json(
        { message: "模板名称和内容是必需的" },
        { status: 400 }
      )
    }

    // Determine which family to check permission against
    let checkFamilyId = familyId

    // If ancestorId is provided, it takes precedence for family check
    if (ancestorId) {
      const ancestor = await prisma.ancestor.findUnique({
        where: { id: ancestorId },
      })

      if (!ancestor) {
        return NextResponse.json(
          { message: "先祖不存在" },
          { status: 404 }
        )
      }

      // If familyId provided, verify ancestor belongs to family
      if (familyId && ancestor.familyId !== familyId) {
        return NextResponse.json(
          { message: "先祖不属于该家族" },
          { status: 400 }
        )
      }

      checkFamilyId = ancestor.familyId
    }

    // Check if user has ADMIN permission in the relevant family
    if (checkFamilyId) {
      const familyMember = await checkFamilyMembership(session.user.id, checkFamilyId)
      if (!familyMember) {
        return NextResponse.json(
          { message: "您不是该家族的成员" },
          { status: 403 }
        )
      }

      if (!isAdmin(familyMember.role)) {
        return NextResponse.json(
          { message: "您没有权限创建致词模板" },
          { status: 403 }
        )
      }
    }

    // Create the eulogy template
    const eulogy = await prisma.eulogy.create({
      data: {
        ancestorId: ancestorId || null,
        templateName,
        content,
        isTemplate: true,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        message: "致词模板创建成功",
        eulogy,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/eulogies/templates] Error:", error)
    return NextResponse.json(
      { message: "创建致词模板失败" },
      { status: 500 }
    )
  }
}
