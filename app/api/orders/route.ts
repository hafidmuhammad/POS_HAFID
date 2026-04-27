import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all orders
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (type) where.type = type

    const orders = await prisma.order.findMany({
      where,
      include: { items: true, cashier: { select: { name: true } } },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('GET orders error:', error)
    return NextResponse.json({ error: 'Gagal memuat pesanan.' }, { status: 500 })
  }
}

// POST create order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, ...orderData } = body

    // Generate order number
    const lastOrder = await prisma.order.findFirst({ orderBy: { id: 'desc' } })
    const nextNum = (lastOrder?.id || 0) + 1
    const orderNo = `#ORD-${String(nextNum).padStart(4, '0')}`

    const order = await prisma.order.create({
      data: {
        ...orderData,
        orderNo,
        items: {
          create: items.map((item: { name: string; qty: number; price: number; productId?: number }) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            subtotal: item.qty * item.price,
            productId: item.productId || null,
          })),
        },
      },
      include: { items: true },
    })

    // Decrease stock for each item
    for (const item of items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        })
      }
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('POST order error:', error)
    return NextResponse.json({ error: 'Gagal membuat pesanan.' }, { status: 500 })
  }
}
