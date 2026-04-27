import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'

// GET single user
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true, name: true, username: true, role: true,
        phone: true, status: true, lastLogin: true, createdAt: true,
      },
    })
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    console.error('GET user error:', error)
    return NextResponse.json({ error: 'Gagal memuat user.' }, { status: 500 })
  }
}

// PUT update user
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    // If updating password, hash it
    if (body.password) {
      body.password = await bcryptjs.hash(body.password, 10)
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: body,
      select: {
        id: true, name: true, username: true, role: true,
        phone: true, status: true, lastLogin: true,
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error('PUT user error:', error)
    return NextResponse.json({ error: 'Gagal mengupdate user.' }, { status: 500 })
  }
}

// DELETE user
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.user.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE user error:', error)
    return NextResponse.json({ error: 'Gagal menghapus user.' }, { status: 500 })
  }
}
