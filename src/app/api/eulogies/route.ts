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

// Helper function to check if user has EDITOR or ADMIN role
function hasEditPermission(role: string): boolean {
  return role === "EDITOR" || role === "ADMIN"
}

// Helper function to check if user is an ADMIN
function isAdmin(role: string): boolean {
  return role === "ADMIN"
}

// GET /api/eulogies - Get eulogy list for an ancestor
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

    if (!ancestorId && !familyId) {
      return NextResponse.json(
        { message: "需要提供 ancestorId 或 familyId" },
        { status: 400 }
      )
    }

    let eulogies: any[] = []
    if (ancestorId) {
      // Get eulogies for specific ancestor - any family member can view
      const familyMember = await prisma.familyMember.findFirst({
        where: {
          userId: session.user.id,
          family: {
            ancestors: {
              some: {
                id: ancestorId,
              },
            },
          },
        },
      })

      if (!familyMember) {
        return NextResponse.json(
          { message: "您不是该家族的成员" },
          { status: 403 }
        )
      }

      eulogies = await prisma.eulogy.findMany({
        where: {
          ancestorId,
          isTemplate: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    } else if (familyId) {
      // Get all eulogies for family ancestors - any family member can view
      const familyMember = await checkFamilyMembership(session.user.id, familyId)
      if (!familyMember) {
        return NextResponse.json(
          { message: "您不是该家族的成员" },
          { status: 403 }
        )
      }

      eulogies = await prisma.eulogy.findMany({
        where: {
          ancestor: {
            familyId,
          },
          isTemplate: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
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
        },
      })
    }

    return NextResponse.json({ eulogies }, { status: 200 })
  } catch (error) {
    console.error("[GET /api/eulogies] Error:", error)
    return NextResponse.json(
      { message: "获取致词列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/eulogies - Create a new eulogy
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
    const { ancestorId, content } = body

    // Validate required fields
    if (!ancestorId || !content) {
      return NextResponse.json(
        { message: "先祖ID和内容是必需的" },
        { status: 400 }
      )
    }

    // Get ancestor to determine family
    const ancestor = await prisma.ancestor.findUnique({
      where: { id: ancestorId },
    })

    if (!ancestor) {
      return NextResponse.json(
        { message: "先祖不存在" },
        { status: 404 }
      )
    }

    // Check if user is a family member
    const familyMember = await checkFamilyMembership(session.user.id, ancestor.familyId)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    // Only EDITOR and ADMIN can create eulogies
    if (!hasEditPermission(familyMember.role)) {
      return NextResponse.json(
        { message: "您没有权限创建致词" },
        { status: 403 }
      )
    }

    // Check if a non-template eulogy already exists for this ancestor and author
    const existingEulogy = await prisma.eulogy.findFirst({
      where: {
        ancestorId,
        authorId: session.user.id,
        isTemplate: false,
      },
    })

    if (existingEulogy) {
      return NextResponse.json(
        { message: "您已经为此先祖创建过致词" },
        { status: 400 }
      )
    }

    // Create the eulogy
    const eulogy = await prisma.eulogy.create({
      data: {
        ancestorId,
        content,
        isTemplate: false,
        authorId: session.user.id,
      },
      include: {
        author: {
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
        message: "致词创建成功",
        eulogy,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/eulogies] Error:", error)
    return NextResponse.json(
      { message: "创建致词失败" },
      { status: 500 }
    )
  }
}

// PUT /api/eulogies - Update an eulogy
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
    const { eulogyId, content } = body

    // Validate required fields
    if (!eulogyId || content === undefined) {
      return NextResponse.json(
        { message: "致词ID和内容是必需的" },
        { status: 400 }
      )
    }

    // Get the eulogy
    const eulogy = await prisma.eulogy.findUnique({
      where: { id: eulogyId },
      include: {
        ancestor: true,
      },
    })

    if (!eulogy) {
      return NextResponse.json(
        { message: "致词不存在" },
        { status: 404 }
      )
    }

    // Check if user is a family member
    const familyMember = await checkFamilyMembership(session.user.id, eulogy.ancestor.familyId)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    // Only EDITOR and ADMIN can edit eulogies
    if (!hasEditPermission(familyMember.role)) {
      return NextResponse.json(
        { message: "您没有权限编辑致词" },
        { status: 403 }
      )
    }

    // Update the eulogy
    const updatedEulogy = await prisma.eulogy.update({
      where: { id: eulogyId },
      data: {
        content,
      },
      include: {
        author: {
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
        message: "致词更新成功",
        eulogy: updatedEulogy,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[PUT /api/eulogies] Error:", error)
    return NextResponse.json(
      { message: "更新致词失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/eulogies - Delete an eulogy
export async function DELETE(request: NextRequest) {
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
    const { eulogyId } = body

    // Validate required fields
    if (!eulogyId) {
      return NextResponse.json(
        { message: "致词ID是必需的" },
        { status: 400 }
      )
    }

    // Get the eulogy
    const eulogy = await prisma.eulogy.findUnique({
      where: { id: eulogyId },
      include: {
        ancestor: true,
      },
    })

    if (!eulogy) {
      return NextResponse.json(
        { message: "致词不存在" },
        { status: 404 }
      )
    }

    // Check if user is a family member
    const familyMember = await checkFamilyMembership(session.user.id, eulogy.ancestor.familyId)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    // Only ADMIN can delete eulogies
    if (!isAdmin(familyMember.role)) {
      return NextResponse.json(
        { message: "您没有权限删除致词" },
        { status: 403 }
      )
    }

    // Delete the eulogy
    await prisma.eulogy.delete({
      where: { id: eulogyId },
    })

    return NextResponse.json(
      {
        message: "致词删除成功",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[DELETE /api/eulogies] Error:", error)
    return NextResponse.json(
      { message: "删除致词失败" },
      { status: 500 }
    )
  }
}
