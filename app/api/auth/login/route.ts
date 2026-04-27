import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json()

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, dan role wajib diisi.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) {
      return NextResponse.json(
        { error: 'Username tidak ditemukan.' },
        { status: 401 }
      )
    }

    if (user.status === 'nonaktif') {
      return NextResponse.json(
        { error: 'Akun dinonaktifkan. Hubungi admin.' },
        { status: 403 }
      )
    }

    if (user.role !== role) {
      return NextResponse.json(
        { error: 'Role tidak sesuai dengan akun ini.' },
        { status: 401 }
      )
    }

    const valid = await bcryptjs.compare(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: 'Password salah.' },
        { status: 401 }
      )
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server.' },
      { status: 500 }
    )
  }
}
