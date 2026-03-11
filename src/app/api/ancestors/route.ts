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

// Helper function to check if user has edit permissions (EDITOR or ADMIN)
function hasEditPermission(role: string): boolean {
  return role === "EDITOR" || role === "ADMIN"
}

// GET /api/ancestors - Get ancestors for a family
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
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

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
      OR?: Array<{ firstName?: { contains: string }; lastName?: { contains: string } }>
    } = {
      familyId,
    }

    // Add search filter if provided
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ]
    }

    // Get total count for pagination
    const total = await prisma.ancestor.count({ where })

    // Get ancestors with pagination
    const ancestors = await prisma.ancestor.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
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

    return NextResponse.json(
      {
        ancestors,
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
    console.error("[GET /api/ancestors] Error:", error)
    return NextResponse.json(
      { message: "获取先祖列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/ancestors - Create a new ancestor
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
      firstName,
      lastName,
      gender,
      birthDate,
      deathDate,
      birthPlace,
      deathPlace,
      bio,
    } = body

    // Validate required fields
    if (!familyId || !firstName || !gender) {
      return NextResponse.json(
        { message: "家族ID、名字和性别是必需的" },
        { status: 400 }
      )
    }

    // Validate gender
    const validGenders = ["男", "女", "其他"]
    if (!validGenders.includes(gender)) {
      return NextResponse.json(
        { message: "无效的性别值" },
        { status: 400 }
      )
    }

    // Check if user is a member of this family with edit permissions
    const familyMember = await checkFamilyMembership(session.user.id, familyId)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    if (!hasEditPermission(familyMember.role)) {
      return NextResponse.json(
        { message: "您没有权限创建先祖信息" },
        { status: 403 }
      )
    }

    // Create the ancestor
    const ancestor = await prisma.ancestor.create({
      data: {
        familyId,
        firstName,
        lastName: lastName || null,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        deathDate: deathDate ? new Date(deathDate) : null,
        birthPlace: birthPlace || null,
        deathPlace: deathPlace || null,
        bio: bio || null,
      },
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        familyId,
        ancestorId: ancestor.id,
        type: "ancestor_created",
        itemId: ancestor.id,
        itemName: `${ancestor.firstName}${ancestor.lastName || ""}`,
        description: `创建了先祖信息: ${ancestor.firstName}${ancestor.lastName || ""}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        message: "先祖信息创建成功",
        ancestor,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/ancestors] Error:", error)
    return NextResponse.json(
      { message: "创建先祖信息失败" },
      { status: 500 }
    )
  }
}

// PUT /api/ancestors - Update an ancestor
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
    const {
      id,
      familyId,
      firstName,
      lastName,
      gender,
      birthDate,
      deathDate,
      birthPlace,
      deathPlace,
      bio,
    } = body

    // Validate required fields
    if (!id || !familyId) {
      return NextResponse.json(
        { message: "先祖ID和家族ID是必需的" },
        { status: 400 }
      )
    }

    // Validate gender if provided
    if (gender) {
      const validGenders = ["男", "女", "其他"]
      if (!validGenders.includes(gender)) {
        return NextResponse.json(
          { message: "无效的性别值" },
          { status: 400 }
        )
      }
    }

    // Check if user is a member of this family with edit permissions
    const familyMember = await checkFamilyMembership(session.user.id, familyId)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    if (!hasEditPermission(familyMember.role)) {
      return NextResponse.json(
        { message: "您没有权限更新先祖信息" },
        { status: 403 }
      )
    }

    // Check if ancestor exists and belongs to the family
    const existingAncestor = await prisma.ancestor.findFirst({
      where: {
        id,
        familyId,
      },
    })

    if (!existingAncestor) {
      return NextResponse.json(
        { message: "先祖信息不存在" },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: {
      firstName?: string
      lastName?: string | null
      gender?: string
      birthDate?: Date | null
      deathDate?: Date | null
      birthPlace?: string | null
      deathPlace?: string | null
      bio?: string | null
    } = {}

    if (firstName !== undefined) updateData.firstName = firstName
    if (lastName !== undefined) updateData.lastName = lastName || null
    if (gender !== undefined) updateData.gender = gender
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null
    if (deathDate !== undefined) updateData.deathDate = deathDate ? new Date(deathDate) : null
    if (birthPlace !== undefined) updateData.birthPlace = birthPlace || null
    if (deathPlace !== undefined) updateData.deathPlace = deathPlace || null
    if (bio !== undefined) updateData.bio = bio || null

    // Update the ancestor
    const updatedAncestor = await prisma.ancestor.update({
      where: { id },
      data: updateData,
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        familyId,
        ancestorId: updatedAncestor.id,
        type: "ancestor_updated",
        itemId: updatedAncestor.id,
        itemName: `${updatedAncestor.firstName}${updatedAncestor.lastName || ""}`,
        description: `更新了先祖信息: ${updatedAncestor.firstName}${updatedAncestor.lastName || ""}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        message: "先祖信息更新成功",
        ancestor: updatedAncestor,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[PUT /api/ancestors] Error:", error)
    return NextResponse.json(
      { message: "更新先祖信息失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/ancestors - Delete an ancestor
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const familyId = searchParams.get("familyId")

    // Validate required fields
    if (!id || !familyId) {
      return NextResponse.json(
        { message: "先祖ID和家族ID是必需的" },
        { status: 400 }
      )
    }

    // Check if user is a member of this family with edit permissions
    const familyMember = await checkFamilyMembership(session.user.id, familyId)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    if (!hasEditPermission(familyMember.role)) {
      return NextResponse.json(
        { message: "您没有权限删除先祖信息" },
        { status: 403 }
      )
    }

    // Check if ancestor exists and belongs to the family
    const existingAncestor = await prisma.ancestor.findFirst({
      where: {
        id,
        familyId,
      },
    })

    if (!existingAncestor) {
      return NextResponse.json(
        { message: "先祖信息不存在" },
        { status: 404 }
      )
    }

    // Store ancestor name for activity log
    const ancestorName = `${existingAncestor.firstName}${existingAncestor.lastName || ""}`

    // Delete the ancestor (cascade will delete related records)
    await prisma.ancestor.delete({
      where: { id },
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        familyId,
        ancestorId: null,
        type: "ancestor_deleted",
        itemId: id,
        itemName: ancestorName,
        description: `删除了先祖信息: ${ancestorName}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      { message: "先祖信息删除成功" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[DELETE /api/ancestors] Error:", error)
    return NextResponse.json(
      { message: "删除先祖信息失败" },
      { status: 500 }
    )
  }
}