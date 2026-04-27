/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('../../lib/generated/prisma')
const bcryptjs = require('bcryptjs')

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/sembako_pos' } },
})

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Seed Users ──────────────────────────────
  const users = [
    { name: 'Admin Utama',  username: 'superadmin', password: 'admin123',   role: 'superadmin' },
    { name: 'Budi Manager', username: 'manager',    password: 'manager123', role: 'manager' },
    { name: 'Rina Kasir',   username: 'kasir',      password: 'kasir123',   role: 'kasir' },
    { name: 'Doni Gudang',  username: 'gudang',     password: 'gudang123',  role: 'gudang' },
    { name: 'Pak Owner',    username: 'owner',      password: 'owner123',   role: 'owner' },
  ]

  for (const u of users) {
    const hash = await bcryptjs.hash(u.password, 10)
    await prisma.user.upsert({
      where: { username: u.username },
      update: { password: hash },
      create: {
        name: u.name,
        username: u.username,
        password: hash,
        role: u.role,
        status: 'aktif',
      },
    })
    console.log(`  ✅ User: ${u.username} (${u.role})`)
  }

  // ─── Seed Products ───────────────────────────
  const products = [
    { sku:'BRS-001', name:'Beras Premium',  emoji:'🌾', category:'Beras',   unit:'1 kg',   price:15000, stock:84,  bulkSack:4, bulkKg:100, minStock:20 },
    { sku:'BRS-002', name:'Beras Medium',   emoji:'🌾', category:'Beras',   unit:'1 kg',   price:12000, stock:120, bulkSack:6, bulkKg:150, minStock:30 },
    { sku:'GLA-001', name:'Gula Pasir',     emoji:'🍬', category:'Gula',    unit:'1 kg',   price:14000, stock:15,  bulkSack:3, bulkKg:150, minStock:20 },
    { sku:'GLA-002', name:'Gula Merah',     emoji:'🍫', category:'Gula',    unit:'500 g',  price:8000,  stock:40,  bulkSack:2, bulkKg:50,  minStock:10 },
    { sku:'MNY-001', name:'Minyak Goreng',  emoji:'🧴', category:'Minyak',  unit:'1 L',    price:18000, stock:8,   bulkSack:1, bulkKg:20,  minStock:15 },
    { sku:'MNY-002', name:'Minyak Kelapa',  emoji:'🥥', category:'Minyak',  unit:'1 L',    price:22000, stock:35,  bulkSack:2, bulkKg:40,  minStock:10 },
    { sku:'TPG-001', name:'Tepung Terigu',  emoji:'⚪', category:'Tepung',  unit:'500 g',  price:6500,  stock:20,  bulkSack:3, bulkKg:75,  minStock:25 },
    { sku:'TPG-002', name:'Tepung Beras',   emoji:'⬜', category:'Tepung',  unit:'500 g',  price:7000,  stock:30,  bulkSack:2, bulkKg:50,  minStock:15 },
    { sku:'GRM-001', name:'Garam Halus',    emoji:'🧂', category:'Bumbu',   unit:'250 g',  price:3000,  stock:72,  bulkSack:5, bulkKg:125, minStock:20 },
    { sku:'KCP-001', name:'Kecap Manis',    emoji:'🍶', category:'Bumbu',   unit:'275 ml', price:9500,  stock:25,  bulkSack:0, bulkKg:0,   minStock:10 },
    { sku:'SNT-001', name:'Santan Kelapa',  emoji:'🥛', category:'Lainnya', unit:'65 ml',  price:4500,  stock:60,  bulkSack:0, bulkKg:0,   minStock:15 },
    { sku:'KPG-001', name:'Kopi Bubuk',     emoji:'☕', category:'Minuman', unit:'200 g',  price:18000, stock:22,  bulkSack:0, bulkKg:0,   minStock:10 },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: { ...p },
      create: { ...p },
    })
    console.log(`  ✅ Product: ${p.name} (${p.sku})`)
  }

  // ─── Seed Sample Orders ──────────────────────
  const kasir = await prisma.user.findUnique({ where: { username: 'kasir' } })

  const ordersData = [
    {
      orderNo: '#ORD-0091', customer: 'Ibu Sari', type: 'Online', method: 'Transfer',
      subtotal: 125000, total: 135000, shipping: 10000, status: 'paid',
      phone: '08123456789', address: 'Jl. Merpati 12',
      items: [{ name: 'Beras Premium 1kg', qty: 5, price: 15000 }, { name: 'Gula Pasir 1kg', qty: 2, price: 14000 }]
    },
    {
      orderNo: '#ORD-0090', customer: 'Pak Budi', type: 'Tunai', method: 'Tunai',
      subtotal: 87500, total: 87500, status: 'paid',
      items: [{ name: 'Minyak Goreng 1L', qty: 3, price: 18000 }, { name: 'Garam Halus 250g', qty: 5, price: 3000 }]
    },
    {
      orderNo: '#ORD-0089', customer: 'Dewi R.', type: 'Online', method: 'QRIS',
      subtotal: 210000, total: 210000, status: 'process',
      items: [{ name: 'Beras Medium 1kg', qty: 10, price: 12000 }, { name: 'Tepung Terigu 500g', qty: 4, price: 6500 }]
    },
    {
      orderNo: '#ORD-0088', customer: 'Hendra W.', type: 'Tunai', method: 'Tunai',
      subtotal: 55000, total: 55000, status: 'paid',
      items: [{ name: 'Gula Pasir 1kg', qty: 2, price: 14000 }, { name: 'Santan Kelapa 65ml', qty: 3, price: 4500 }]
    },
    {
      orderNo: '#ORD-0087', customer: 'Rina K.', type: 'Online', method: 'COD',
      subtotal: 340000, total: 360000, shipping: 20000, status: 'pending',
      items: [{ name: 'Beras Premium 1kg', qty: 10, price: 15000 }, { name: 'Minyak Goreng 1L', qty: 5, price: 18000 }]
    },
  ]

  for (const o of ordersData) {
    const existing = await prisma.order.findUnique({ where: { orderNo: o.orderNo } })
    if (!existing) {
      await prisma.order.create({
        data: {
          orderNo: o.orderNo,
          customer: o.customer,
          type: o.type,
          method: o.method,
          subtotal: o.subtotal,
          total: o.total,
          shipping: o.shipping || 0,
          discount: 0,
          tax: 0,
          status: o.status,
          phone: o.phone || null,
          address: o.address || null,
          cashierId: kasir?.id || null,
          items: {
            create: o.items.map(item => ({
              name: item.name,
              qty: item.qty,
              price: item.price,
              subtotal: item.qty * item.price,
            }))
          }
        }
      })
      console.log(`  ✅ Order: ${o.orderNo} — ${o.customer}`)
    }
  }

  console.log('\n🎉 Seeding selesai!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

