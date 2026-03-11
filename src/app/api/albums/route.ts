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

// GET /api/albums - Get photos for a family or ancestor
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
    const ancestorId = searchParams.get("ancestorId")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const sortBy = searchParams.get("sortBy") || "uploadedAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Validate required fields - need either familyId or ancestorId
    if (!familyId && !ancestorId) {
      return NextResponse.json(
        { message: "家族ID或先祖ID是必需的" },
        { status: 400 }
      )
    }

    // If ancestorId provided, get familyId from ancestor and verify access
    let targetFamilyId = familyId
    if (ancestorId) {
      const ancestor = await prisma.ancestor.findUnique({
        where: { id: ancestorId },
        select: { familyId: true },
      })
      
      if (!ancestor) {
        return NextResponse.json(
          { message: "先祖不存在" },
          { status: 404 }
        )
      }
      
      targetFamilyId = ancestor.familyId
    }

    // Check if user is a member of this family
    const familyMember = await checkFamilyMembership(session.user.id, targetFamilyId!)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    // Build where clause
    const where: {
      OR?: Array<{ familyId?: string | null; ancestorId?: string | null }>
      title?: { contains: string }
    } = {}


    // Filter by ancestor or family
    if (ancestorId) {
      where.OR = [
        { ancestorId },
        { familyId: targetFamilyId!, ancestorId: null }
      ]
    } else {
      where.OR = [
        { familyId: targetFamilyId! }
      ]
    }

    // Add search filter if provided
    if (search) {
      where.title = { contains: search }
    }

    // Get total count for pagination
    const total = await prisma.photo.count({ where })

    // Get photos with pagination
    const photos = await prisma.photo.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        uploader: {
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

    return NextResponse.json(
      {
        photos,
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
    console.error("[GET /api/albums] Error:", error)
    return NextResponse.json(
      { message: "获取照片列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/albums - Create a new photo
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
      title,
      description,
      imageUrl,
    } = body

    // Validate required fields
    if (!title || !imageUrl) {
      return NextResponse.json(
        { message: "标题和图片URL是必需的" },
        { status: 400 }
      )
    }

    // Must have either familyId or ancestorId
    if (!familyId && !ancestorId) {
      return NextResponse.json(
        { message: "必须指定家族ID或先祖ID" },
        { status: 400 }
      )
    }

    // Determine familyId
    let targetFamilyId = familyId
    if (ancestorId) {
      const ancestor = await prisma.ancestor.findUnique({
        where: { id: ancestorId },
        select: { familyId: true },
      })
      
      if (!ancestor) {
        return NextResponse.json(
          { message: "先祖不存在" },
          { status: 404 }
        )
      }
      
      targetFamilyId = ancestor.familyId
    }

    // Check if user is a member of this family with edit permissions
    const familyMember = await checkFamilyMembership(session.user.id, targetFamilyId!)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    if (!hasEditPermission(familyMember.role)) {
      return NextResponse.json(
        { message: "您没有权限上传照片" },
        { status: 403 }
      )
    }

    // Create the photo
    const photo = await prisma.photo.create({
      data: {
        familyId: targetFamilyId,
        ancestorId: ancestorId || null,
        title,
        description: description || null,
        imageUrl,
        uploaderId: session.user.id,
      },
      include: {
        uploader: {
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

    // Create activity log
    await prisma.activity.create({
      data: {
        familyId: targetFamilyId!,
        ancestorId: ancestorId || null,
        type: "photo_uploaded",
        itemId: photo.id,
        itemName: photo.title,
        description: `上传了照片: ${photo.title}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        message: "照片上传成功",
        photo,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/albums] Error:", error)
    return NextResponse.json(
      { message: "上传照片失败" },
      { status: 500 }
    )
  }
}

// PUT /api/albums - Update a photo
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
      ancestorId,
      title,
      description,
      imageUrl,
    } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { message: "照片ID是必需的" },
        { status: 400 }
      )
    }

    // Check if photo exists
    const existingPhoto = await prisma.photo.findUnique({
      where: { id },
      include: {
        ancestor: {
          select: { familyId: true },
        },
      },
    })

    if (!existingPhoto) {
      return NextResponse.json(
        { message: "照片不存在" },
        { status: 404 }
      )
    }

    // Determine familyId for authorization check
    const targetFamilyId = familyId || existingPhoto.familyId || existingPhoto.ancestor?.familyId

    if (!targetFamilyId) {
      return NextResponse.json(
        { message: "无法确定照片所属家族" },
        { status: 400 }
      )
    }

    // Check if user is a member of this family with edit permissions
    const familyMember = await checkFamilyMembership(session.user.id, targetFamilyId)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    if (!hasEditPermission(familyMember.role)) {
      return NextResponse.json(
        { message: "您没有权限更新照片" },
        { status: 403 }
      )
    }

    // Build update data
    const updateData: {
      title?: string
      description?: string | null
      imageUrl?: string
      ancestorId?: string | null
      familyId?: string | null
    } = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description || null
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (ancestorId !== undefined) updateData.ancestorId = ancestorId || null
    if (familyId !== undefined) updateData.familyId = familyId || null

    // Update the photo
    const updatedPhoto = await prisma.photo.update({
      where: { id },
      data: updateData,
      include: {
        uploader: {
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

    // Create activity log
    await prisma.activity.create({
      data: {
        familyId: targetFamilyId,
        ancestorId: updatedPhoto.ancestorId,
        type: "photo_updated",
        itemId: updatedPhoto.id,
        itemName: updatedPhoto.title,
        description: `更新了照片: ${updatedPhoto.title}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        message: "照片更新成功",
        photo: updatedPhoto,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[PUT /api/albums] Error:", error)
    return NextResponse.json(
      { message: "更新照片失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/albums - Delete a photo
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
    if (!id) {
      return NextResponse.json(
        { message: "照片ID是必需的" },
        { status: 400 }
      )
    }

    // Check if photo exists
    const existingPhoto = await prisma.photo.findUnique({
      where: { id },
      include: {
        ancestor: {
          select: { familyId: true },
        },
      },
    })

    if (!existingPhoto) {
      return NextResponse.json(
        { message: "照片不存在" },
        { status: 404 }
      )
    }

    // Determine familyId for authorization check
    const targetFamilyId = familyId || existingPhoto.familyId || existingPhoto.ancestor?.familyId

    if (!targetFamilyId) {
      return NextResponse.json(
        { message: "无法确定照片所属家族" },
        { status: 400 }
      )
    }

    // Check if user is a member of this family with edit permissions
    const familyMember = await checkFamilyMembership(session.user.id, targetFamilyId)
    if (!familyMember) {
      return NextResponse.json(
        { message: "您不是该家族的成员" },
        { status: 403 }
      )
    }

    if (!hasEditPermission(familyMember.role)) {
      return NextResponse.json(
        { message: "您没有权限删除照片" },
        { status: 403 }
      )
    }

    // Store photo info for activity log
    const photoTitle = existingPhoto.title
    const ancestorId = existingPhoto.ancestorId

    // Delete the photo
    await prisma.photo.delete({
      where: { id },
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        familyId: targetFamilyId,
        ancestorId: ancestorId,
        type: "photo_deleted",
        itemId: id,
        itemName: photoTitle,
        description: `删除了照片: ${photoTitle}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      { message: "照片删除成功" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[DELETE /api/albums] Error:", error)
    return NextResponse.json(
      { message: "删除照片失败" },
      { status: 500 }
    )
  }
}