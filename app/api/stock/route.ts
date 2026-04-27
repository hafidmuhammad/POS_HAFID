import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET stock movements
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    const where: Record<string, unknown> = {}
    if (productId) where.productId = Number(productId)

    const movements = await prisma.stockMovement.findMany({
      where,
      include: {
        product: { select: { name: true, sku: true } },
        user: { select: { name: true } },
      },
      orderBy: { date: 'desc' },
      take: 100,
    })
    return NextResponse.json(movements)
  } catch (error) {
    console.error('GET stock movements error:', error)
    return NextResponse.json({ error: 'Gagal memuat riwayat stok.' }, { status: 500 })
  }
}

// POST create stock movement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, type, qtyChange, note, userId } = body

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 })
    }

    const qtyBefore = product.stock
    const delta = type === 'masuk' ? qtyChange : -qtyChange
    const qtyAfter = qtyBefore + delta

    // Update product stock
    await prisma.product.update({
      where: { id: productId },
      data: { stock: qtyAfter },
    })

    // Record movement
    const movement = await prisma.stockMovement.create({
      data: {
        productId,
        type,
        qtyBefore,
        qtyChange: delta,
        qtyAfter,
        unit: product.unit,
        note: note || null,
        userId: userId || null,
      },
      include: {
        product: { select: { name: true, sku: true } },
        user: { select: { name: true } },
      },
    })

    return NextResponse.json(movement, { status: 201 })
  } catch (error) {
    console.error('POST stock movement error:', error)
    return NextResponse.json({ error: 'Gagal mencatat pergerakan stok.' }, { status: 500 })
  }
}
