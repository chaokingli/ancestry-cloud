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

// POST /api/worship - Create a new worship record
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
      ancestorId,
      familyId,
      worshipType,
      notes,
    } = body

    // Validate required fields
    if (!ancestorId || !familyId || !worshipType) {
      return NextResponse.json(
        { message: "祖先ID、家族ID和祭拜类型是必需的" },
        { status: 400 }
      )
    }

    // Validate worship type
    const validWorshipTypes = ["incense", "offerings", "bowing", "paper_money"]
    if (!validWorshipTypes.includes(worshipType)) {
      return NextResponse.json(
        { message: "无效的祭拜类型" },
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

    // Verify the ancestor exists and belongs to the specified family
    const ancestor = await prisma.ancestor.findFirst({
      where: {
        id: ancestorId,
        familyId,
      },
    })

    if (!ancestor) {
      return NextResponse.json(
        { message: "祖先记录不存在或不属于该家族" },
        { status: 404 }
      )
    }

    // Create the worship record
    const worshipRecord = await prisma.worshipRecord.create({
      data: {
        ancestorId,
        familyId,
        worshipType,
        notes: notes || null,
        creatorId: session.user.id,
      },
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        familyId,
        ancestorId: ancestor.id,
        type: "worship_created",
        itemId: worshipRecord.id,
        itemName: `${ancestor.firstName}${ancestor.lastName || ""}`,
        description: `创建了祭拜记录: ${ancestor.firstName}${ancestor.lastName || ""} (${worshipType})`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        message: "祭拜记录创建成功",
        worshipRecord,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/worship] Error:", error)
    return NextResponse.json(
      { message: "创建祭拜记录失败" },
      { status: 500 }
    )
  }
}