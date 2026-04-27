export type Role = 'superadmin' | 'manager' | 'kasir' | 'gudang' | 'owner'

export interface User {
  id: string
  name: string
  username: string
  role: Role
  phone?: string
  status: 'aktif' | 'nonaktif'
  lastLogin: string
}

export interface Product {
  id: number
  sku: string
  name: string
  emoji: string
  category: string
  unit: string
  price: number
  stock: number
  bulkSack: number
  bulkKg: number
  minStock: number
}

export interface CartItem extends Product {
  qty: number
}

export interface OrderItem {
  name: string
  qty: number
  price: number
}

export type OrderType = 'Tunai' | 'Online' | 'Staf Offline'
export type OrderStatus = 'paid' | 'pending' | 'process' | 'cancel'
export type PaymentMethod = 'Tunai' | 'Transfer' | 'QRIS' | 'Debit' | 'Kredit' | 'COD'

export interface Order {
  id: string
  customer: string
  type: OrderType
  method: PaymentMethod
  total: number
  subtotal: number
  discount: number
  tax: number
  shipping: number
  status: OrderStatus
  items: OrderItem[]
  date: string
  phone?: string
  address?: string
  cashier?: string
}

export interface StockMovement {
  id: string
  productId: number
  productName: string
  type: 'masuk' | 'keluar' | 'konversi' | 'opname'
  qtyBefore: number
  qtyChange: number
  qtyAfter: number
  unit: string
  note: string
  date: string
  user: string
}
