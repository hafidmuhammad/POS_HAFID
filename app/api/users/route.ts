import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        phone: true,
        status: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { id: 'asc' },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('GET users error:', error)
    return NextResponse.json({ error: 'Gagal memuat user.' }, { status: 500 })
  }
}

// POST create user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password, ...rest } = body

    const existing = await prisma.user.findUnique({ where: { username: rest.username } })
    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan.' }, { status: 409 })
    }

    const hash = await bcryptjs.hash(password, 10)
    const user = await prisma.user.create({
      data: { ...rest, password: hash },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('POST user error:', error)
    return NextResponse.json({ error: 'Gagal menambah user.' }, { status: 500 })
  }
}
