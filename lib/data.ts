import { Product, User, Order, Role } from './types'

export const DEMO_CREDENTIALS: Record<string, { pass: string; role: Role }> = {
  superadmin: { pass: 'admin123', role: 'superadmin' },
  manager:    { pass: 'manager123', role: 'manager' },
  kasir:      { pass: 'kasir123', role: 'kasir' },
  gudang:     { pass: 'gudang123', role: 'gudang' },
  owner:      { pass: 'owner123', role: 'owner' },
}

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: 'Super Admin',
  manager:    'Manager',
  kasir:      'Kasir',
  gudang:     'Staff Gudang',
  owner:      'Owner',
}

export const ROLE_COLORS: Record<Role, { bg: string; text: string; tw: string }> = {
  superadmin: { bg: '#FEE2E2', text: '#DC2626', tw: 'bg-red-100 text-red-600' },
  manager:    { bg: '#DBEAFE', text: '#2563EB', tw: 'bg-blue-100 text-blue-600' },
  kasir:      { bg: '#CCFBF1', text: '#0D9488', tw: 'bg-teal-100 text-teal-600' },
  gudang:     { bg: '#FEF3C7', text: '#D97706', tw: 'bg-amber-100 text-amber-600' },
  owner:      { bg: '#EDE9FE', text: '#7C3AED', tw: 'bg-purple-100 text-purple-600' },
}

export type NavPage =
  | 'dashboard' | 'pos' | 'online' | 'orders'
  | 'stock' | 'users' | 'reports' | 'settings'

export type NavItem =
  | { type: 'section'; label: string }
  | { type: 'item'; id: NavPage; label: string; icon: string; badge?: number; disabled?: boolean }

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  superadmin: [
    { type: 'section', label: 'Utama' },
    { type: 'item', id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { type: 'item', id: 'pos',       label: 'Kasir / POS', icon: 'CreditCard', badge: 3 },
    { type: 'item', id: 'online',   label: 'Pesanan Online', icon: 'Globe', badge: 5 },
    { type: 'item', id: 'orders',   label: 'Semua Pesanan', icon: 'ClipboardList' },
    { type: 'section', label: 'Gudang' },
    { type: 'item', id: 'stock',    label: 'Manajemen Stok', icon: 'Package' },
    { type: 'section', label: 'Admin' },
    { type: 'item', id: 'users',    label: 'Kelola User', icon: 'Users' },
    { type: 'item', id: 'reports',  label: 'Laporan', icon: 'BarChart2' },
    { type: 'item', id: 'settings', label: 'Pengaturan', icon: 'Settings' },
  ],
  manager: [
    { type: 'section', label: 'Utama' },
    { type: 'item', id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { type: 'item', id: 'orders',   label: 'Semua Pesanan', icon: 'ClipboardList' },
    { type: 'section', label: 'Gudang' },
    { type: 'item', id: 'stock',    label: 'Manajemen Stok', icon: 'Package' },
    { type: 'section', label: 'Laporan' },
    { type: 'item', id: 'reports',  label: 'Laporan', icon: 'BarChart2' },
    { type: 'item', id: 'users',    label: 'Kelola User', icon: 'Users', disabled: true },
    { type: 'item', id: 'settings', label: 'Pengaturan', icon: 'Settings', disabled: true },
  ],
  kasir: [
    { type: 'section', label: 'Kasir' },
    { type: 'item', id: 'pos',    label: 'Kasir / POS', icon: 'CreditCard' },
    { type: 'item', id: 'orders', label: 'Pesanan Masuk', icon: 'ClipboardList', badge: 2 },
    { type: 'item', id: 'online', label: 'Pesanan Online', icon: 'Globe' },
    { type: 'section', label: 'Dibatasi' },
    { type: 'item', id: 'stock',   label: 'Stok (hanya lihat)', icon: 'Package', disabled: true },
    { type: 'item', id: 'reports', label: 'Laporan', icon: 'BarChart2', disabled: true },
  ],
  gudang: [
    { type: 'section', label: 'Gudang' },
    { type: 'item', id: 'stock',     label: 'Manajemen Stok', icon: 'Package' },
    { type: 'item', id: 'dashboard', label: 'Dashboard Stok', icon: 'LayoutDashboard' },
    { type: 'section', label: 'Dibatasi' },
    { type: 'item', id: 'pos',     label: 'Kasir / POS', icon: 'CreditCard', disabled: true },
    { type: 'item', id: 'orders',  label: 'Pesanan', icon: 'ClipboardList', disabled: true },
    { type: 'item', id: 'reports', label: 'Laporan', icon: 'BarChart2', disabled: true },
  ],
  owner: [
    { type: 'section', label: 'Pantau' },
    { type: 'item', id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { type: 'item', id: 'reports',   label: 'Laporan Lengkap', icon: 'BarChart2' },
    { type: 'item', id: 'stock',     label: 'Stok (hanya lihat)', icon: 'Package' },
    { type: 'section', label: 'Dibatasi' },
    { type: 'item', id: 'pos',      label: 'Kasir / POS', icon: 'CreditCard', disabled: true },
    { type: 'item', id: 'orders',   label: 'Pesanan', icon: 'ClipboardList', disabled: true },
    { type: 'item', id: 'users',    label: 'Kelola User', icon: 'Users', disabled: true },
    { type: 'item', id: 'settings', label: 'Pengaturan', icon: 'Settings', disabled: true },
  ],
}

export const PRODUCTS: Product[] = [
  { id:1,  sku:'BRS-001', name:'Beras Premium',  emoji:'🌾', category:'Beras',   unit:'1 kg',   price:15000, stock:84,  bulkSack:4, bulkKg:100, minStock:20 },
  { id:2,  sku:'BRS-002', name:'Beras Medium',   emoji:'🌾', category:'Beras',   unit:'1 kg',   price:12000, stock:120, bulkSack:6, bulkKg:150, minStock:30 },
  { id:3,  sku:'GLA-001', name:'Gula Pasir',     emoji:'🍬', category:'Gula',    unit:'1 kg',   price:14000, stock:15,  bulkSack:3, bulkKg:150, minStock:20 },
  { id:4,  sku:'GLA-002', name:'Gula Merah',     emoji:'🍫', category:'Gula',    unit:'500 g',  price:8000,  stock:40,  bulkSack:2, bulkKg:50,  minStock:10 },
  { id:5,  sku:'MNY-001', name:'Minyak Goreng',  emoji:'🧴', category:'Minyak',  unit:'1 L',    price:18000, stock:8,   bulkSack:1, bulkKg:20,  minStock:15 },
  { id:6,  sku:'MNY-002', name:'Minyak Kelapa',  emoji:'🥥', category:'Minyak',  unit:'1 L',    price:22000, stock:35,  bulkSack:2, bulkKg:40,  minStock:10 },
  { id:7,  sku:'TPG-001', name:'Tepung Terigu',  emoji:'⚪', category:'Tepung',  unit:'500 g',  price:6500,  stock:20,  bulkSack:3, bulkKg:75,  minStock:25 },
  { id:8,  sku:'TPG-002', name:'Tepung Beras',   emoji:'⬜', category:'Tepung',  unit:'500 g',  price:7000,  stock:30,  bulkSack:2, bulkKg:50,  minStock:15 },
  { id:9,  sku:'GRM-001', name:'Garam Halus',    emoji:'🧂', category:'Bumbu',   unit:'250 g',  price:3000,  stock:72,  bulkSack:5, bulkKg:125, minStock:20 },
  { id:10, sku:'KCP-001', name:'Kecap Manis',    emoji:'🍶', category:'Bumbu',   unit:'275 ml', price:9500,  stock:25,  bulkSack:0, bulkKg:0,   minStock:10 },
  { id:11, sku:'SNT-001', name:'Santan Kelapa',  emoji:'🥛', category:'Lainnya', unit:'65 ml',  price:4500,  stock:60,  bulkSack:0, bulkKg:0,   minStock:15 },
  { id:12, sku:'KPG-001', name:'Kopi Bubuk',     emoji:'☕', category:'Minuman', unit:'200 g',  price:18000, stock:22,  bulkSack:0, bulkKg:0,   minStock:10 },
]

export const INITIAL_ORDERS: Order[] = [
  { id:'#ORD-0091', customer:'Ibu Sari',    type:'Online',       method:'Transfer', total:125000, subtotal:125000, discount:0, tax:0, shipping:10000, status:'paid',    date:'14 Apr 2026, 10:22', phone:'08123456789', address:'Jl. Merpati 12', items:[{name:'Beras Premium 1kg',qty:5,price:15000},{name:'Gula Pasir 1kg',qty:2,price:14000}] },
  { id:'#ORD-0090', customer:'Pak Budi',    type:'Tunai',        method:'Tunai',    total:87500,  subtotal:87500,  discount:0, tax:0, shipping:0,     status:'paid',    date:'14 Apr 2026, 09:45', items:[{name:'Minyak Goreng 1L',qty:3,price:18000},{name:'Garam Halus 250g',qty:5,price:3000}] },
  { id:'#ORD-0089', customer:'Dewi R.',     type:'Online',       method:'QRIS',     total:210000, subtotal:210000, discount:0, tax:0, shipping:0,     status:'process', date:'14 Apr 2026, 09:10', items:[{name:'Beras Medium 1kg',qty:10,price:12000},{name:'Tepung Terigu 500g',qty:4,price:6500}] },
  { id:'#ORD-0088', customer:'Hendra W.',   type:'Tunai',        method:'Tunai',    total:55000,  subtotal:55000,  discount:0, tax:0, shipping:0,     status:'paid',    date:'14 Apr 2026, 08:58', items:[{name:'Gula Pasir 1kg',qty:2,price:14000},{name:'Santan Kelapa 65ml',qty:3,price:4500}] },
  { id:'#ORD-0087', customer:'Rina K.',     type:'Online',       method:'COD',      total:340000, subtotal:340000, discount:0, tax:0, shipping:20000, status:'pending', date:'14 Apr 2026, 08:30', items:[{name:'Beras Premium 1kg',qty:10,price:15000},{name:'Minyak Goreng 1L',qty:5,price:18000}] },
  { id:'#ORD-0086', customer:'Staf Offline',type:'Staf Offline', method:'Tunai',    total:97500,  subtotal:97500,  discount:0, tax:0, shipping:0,     status:'process', date:'13 Apr 2026, 16:20', items:[{name:'Tepung Beras 500g',qty:5,price:7000},{name:'Kecap Manis 275ml',qty:5,price:9500}] },
]

export const INITIAL_USERS: User[] = [
  { id:'1', name:'Admin Utama',  username:'superadmin', role:'superadmin', status:'aktif', lastLogin:'14 Apr 2026, 08:12' },
  { id:'2', name:'Budi Manager', username:'manager',    role:'manager',    status:'aktif', lastLogin:'14 Apr 2026, 09:30' },
  { id:'3', name:'Rina Kasir',   username:'kasir',      role:'kasir',      status:'aktif', lastLogin:'14 Apr 2026, 10:05' },
  { id:'4', name:'Doni Gudang',  username:'gudang',     role:'gudang',     status:'aktif', lastLogin:'13 Apr 2026, 15:20' },
  { id:'5', name:'Pak Owner',    username:'owner',      role:'owner',      status:'aktif', lastLogin:'12 Apr 2026, 20:00' },
]

export const fmt = (n: number) =>
  'Rp ' + n.toLocaleString('id-ID')
