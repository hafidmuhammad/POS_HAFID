'use client'
import { create } from 'zustand'
import { CartItem, Order, OrderType, PaymentMethod, Product, User } from './types'
import { INITIAL_ORDERS, INITIAL_USERS, PRODUCTS as INIT_PRODUCTS } from './data'
import { Role } from './types'

interface AuthUser {
  name: string
  username: string
  role: Role
}

interface AppState {
  // Auth
  currentUser: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void

  // Navigation
  activePage: string
  setActivePage: (page: string) => void

  // POS Cart
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  updateCartQty: (id: number, delta: number) => void
  clearCart: () => void
  orderType: OrderType
  setOrderType: (t: OrderType) => void
  payMethod: PaymentMethod
  setPayMethod: (m: PaymentMethod) => void
  discount: number
  setDiscount: (n: number) => void
  discountPct: number
  setDiscountPct: (n: number) => void
  customerName: string
  setCustomerName: (s: string) => void

  // Online Cart
  onlineCart: CartItem[]
  addToOnlineCart: (product: Product) => void
  updateOnlineQty: (id: number, delta: number) => void
  clearOnlineCart: () => void
  onlinePayMethod: PaymentMethod
  setOnlinePayMethod: (m: PaymentMethod) => void

  // Orders
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (id: string, status: Order['status']) => void
  loadCartFromOrder: (orderId: string) => void

  // Products / Stock
  products: Product[]
  updateStock: (productId: number, delta: number) => void

  // Users
  users: User[]
  addUser: (user: User) => void
  toggleUserStatus: (id: string) => void

  // Toast
  toast: string
  showToast: (msg: string) => void

  // Invoice
  lastOrder: Order | null
  setLastOrder: (o: Order | null) => void
  showInvoice: boolean
  setShowInvoice: (v: boolean) => void
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null, cart: [], onlineCart: [], activePage: 'dashboard' }),

  // Nav
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),

  // POS
  cart: [],
  addToCart: (product) => {
    const cart = get().cart
    const ex = cart.find(x => x.id === product.id)
    if (ex) set({ cart: cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c) })
    else set({ cart: [...cart, { ...product, qty: 1 }] })
  },
  removeFromCart: (id) => set({ cart: get().cart.filter(x => x.id !== id) }),
  updateCartQty: (id, delta) => {
    const cart = get().cart.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0)
    set({ cart })
  },
  clearCart: () => set({ cart: [], discount: 0, discountPct: 0, customerName: '' }),
  orderType: 'Tunai',
  setOrderType: (t) => set({ orderType: t }),
  payMethod: 'Tunai',
  setPayMethod: (m) => set({ payMethod: m }),
  discount: 0,
  setDiscount: (n) => set({ discount: n }),
  discountPct: 0,
  setDiscountPct: (n) => set({ discountPct: n }),
  customerName: '',
  setCustomerName: (s) => set({ customerName: s }),

  // Online Cart
  onlineCart: [],
  addToOnlineCart: (product) => {
    const oc = get().onlineCart
    const ex = oc.find(x => x.id === product.id)
    if (ex) set({ onlineCart: oc.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c) })
    else set({ onlineCart: [...oc, { ...product, qty: 1 }] })
  },
  updateOnlineQty: (id, delta) => {
    const onlineCart = get().onlineCart.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0)
    set({ onlineCart })
  },
  clearOnlineCart: () => set({ onlineCart: [] }),
  onlinePayMethod: 'Transfer',
  setOnlinePayMethod: (m) => set({ onlinePayMethod: m }),

  // Orders
  orders: INITIAL_ORDERS,
  addOrder: (order) => set({ orders: [order, ...get().orders] }),
  updateOrderStatus: (id, status) =>
    set({ orders: get().orders.map(o => o.id === id ? { ...o, status } : o) }),
  loadCartFromOrder: (orderId) => {
    const order = get().orders.find(o => o.id === orderId)
    if (!order) return
    const products = get().products
    const cartItems: CartItem[] = order.items.flatMap(item => {
      const p = products.find(p => item.name.includes(p.name))
      return p ? [{ ...p, qty: item.qty }] : []
    })
    set({ cart: cartItems, activePage: 'pos' })
    get().updateOrderStatus(orderId, 'process')
    get().showToast('Pesanan dimuat ke kasir!')
  },

  // Products
  products: INIT_PRODUCTS,
  updateStock: (productId, delta) =>
    set({ products: get().products.map(p => p.id === productId ? { ...p, stock: p.stock + delta } : p) }),

  // Users
  users: INITIAL_USERS,
  addUser: (user) => set({ users: [user, ...get().users] }),
  toggleUserStatus: (id) =>
    set({ users: get().users.map(u => u.id === id ? { ...u, status: u.status === 'aktif' ? 'nonaktif' : 'aktif' } : u) }),

  // Toast
  toast: '',
  showToast: (msg) => {
    set({ toast: msg })
    setTimeout(() => set({ toast: '' }), 2800)
  },

  // Invoice
  lastOrder: null,
  setLastOrder: (o) => set({ lastOrder: o }),
  showInvoice: false,
  setShowInvoice: (v) => set({ showInvoice: v }),
}))
