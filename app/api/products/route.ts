import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('GET products error:', error)
    return NextResponse.json({ error: 'Gagal memuat produk.' }, { status: 500 })
  }
}

// POST create product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const product = await prisma.product.create({ data: body })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('POST product error:', error)
    return NextResponse.json({ error: 'Gagal menambah produk.' }, { status: 500 })
  }
}
