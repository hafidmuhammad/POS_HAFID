import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single product
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id: Number(id) } })
    if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    console.error('GET product error:', error)
    return NextResponse.json({ error: 'Gagal memuat produk.' }, { status: 500 })
  }
}

// PUT update product
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: body,
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('PUT product error:', error)
    return NextResponse.json({ error: 'Gagal mengupdate produk.' }, { status: 500 })
  }
}

// DELETE product (soft delete)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.product.update({
      where: { id: Number(id) },
      data: { isActive: false },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE product error:', error)
    return NextResponse.json({ error: 'Gagal menghapus produk.' }, { status: 500 })
  }
}
