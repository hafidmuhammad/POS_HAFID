import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single order
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: true, cashier: { select: { name: true } } },
    })
    if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    console.error('GET order error:', error)
    return NextResponse.json({ error: 'Gagal memuat pesanan.' }, { status: 500 })
  }
}

// PUT update order (status change)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: body,
      include: { items: true },
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error('PUT order error:', error)
    return NextResponse.json({ error: 'Gagal mengupdate pesanan.' }, { status: 500 })
  }
}

// DELETE order
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.order.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE order error:', error)
    return NextResponse.json({ error: 'Gagal menghapus pesanan.' }, { status: 500 })
  }
}
