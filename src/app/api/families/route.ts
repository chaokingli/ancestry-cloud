import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/families - Get all families for current user
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

    // Get all family members for current user
    const familyMembers = await prisma.familyMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        family: true,
      },
    })

    // Extract unique families from family members
    const families = familyMembers.map((member) => member.family)

    return NextResponse.json({ families }, { status: 200 })
  } catch (error) {
    console.error("[GET /api/families] Error:", error)
    return NextResponse.json(
      { message: "获取家族列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/families - Create a new family
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
    const { name, description } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { message: "家族名称是必需的" },
        { status: 400 }
      )
    }

    // Create the new family
    const family = await prisma.family.create({
      data: {
        name,
        description: description || null,
      },
    })

    // Add current user as a member with EDITOR role
    const familyMember = await prisma.familyMember.create({
      data: {
        userId: session.user.id,
        familyId: family.id,
        role: "EDITOR",
      },
    })

    return NextResponse.json(
      { 
        message: "家族创建成功",
        family: {
          ...family,
          role: familyMember.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/families] Error:", error)
    return NextResponse.json(
      { message: "创建家族失败" },
      { status: 500 }
    )
  }
}
