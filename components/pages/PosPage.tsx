'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { fmt } from '@/lib/data'
import { Product } from '@/lib/types'
import { Search, Trash2, Plus, Minus, CreditCard } from 'lucide-react'
import SuccessModal from '../modals/SuccessModal'

const CATEGORIES = ['Semua', 'Beras', 'Gula', 'Minyak', 'Tepung', 'Bumbu', 'Lainnya', 'Minuman']
const PAY_METHODS = ['Tunai', 'Transfer', 'QRIS', 'Debit', 'Kredit', 'COD'] as const
const ORDER_TYPES = ['Tunai', 'Online', 'Staf Offline'] as const

export default function PosPage() {
  const { products, cart, addToCart, removeFromCart, updateCartQty, clearCart,
    orderType, setOrderType, payMethod, setPayMethod,
    discount, setDiscount, discountPct, setDiscountPct,
    customerName, setCustomerName,
    addOrder, currentUser, setLastOrder, showToast, setActivePage } = useStore()

  const [search, setSearch] = useState('')
  const [activecat, setActiveCat] = useState('Semua')
  const [showSuccess, setShowSuccess] = useState(false)

  const filtered = products.filter(p => {
    const matchCat = activecat === 'Semua' || p.category === activecat
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0)
  const disc = Math.max(discount, Math.round(subtotal * discountPct / 100))
  const taxable = Math.max(0, subtotal - disc)
  const tax = Math.round(taxable * 0.11)
  const total = taxable + tax

  const handlePay = () => {
    if (!cart.length) { showToast('Keranjang kosong!'); return }
    const orderId = '#ORD-' + String(Math.floor(Math.random() * 9000) + 1000)
    const order = {
      id: orderId, customer: customerName || 'Umum', type: orderType,
      method: payMethod, total, subtotal, discount: disc, tax, shipping: 0,
      status: 'paid' as const,
      items: cart.map(c => ({ name: c.name + ' ' + c.unit, qty: c.qty, price: c.price })),
      date: new Date().toLocaleString('id-ID'),
      cashier: currentUser?.name,
    }
    addOrder(order)
    setLastOrder(order)
    clearCart()
    setShowSuccess(true)
  }

  return (
    <div className="p-6 flex gap-4 h-[calc(100vh-65px)]">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A8A59E' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none border-[1.5px]"
              style={{ border: '1.5px solid #E4E2DA', background: '#fff', fontFamily: 'inherit' }}
              placeholder="Cari produk (nama, kode)..." />
          </div>
          <button onClick={() => setActivePage('orders')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: '#0F1F3D', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            Pesanan Masuk
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                cursor: 'pointer', fontFamily: 'inherit',
                background: activecat === cat ? '#0F1F3D' : '#fff',
                color: activecat === cat ? '#fff' : '#6B6860',
                border: `1.5px solid ${activecat === cat ? '#0F1F3D' : '#E4E2DA'}`,
              }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-2.5 overflow-y-auto pb-2"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))' }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />)}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-[350px] flex-shrink-0 rounded-[14px] flex flex-col overflow-hidden"
        style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
        <div className="px-4 py-3.5 flex items-center justify-between border-b" style={{ borderColor: '#E4E2DA' }}>
          <div className="font-bold text-sm">Keranjang Belanja</div>
          <button onClick={clearCart} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
            style={{ color: '#DC2626', border: '1px solid #DC2626', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Trash2 size={11} /> Kosongkan
          </button>
        </div>

        <div className="flex gap-1.5 px-3 pt-3">
          {ORDER_TYPES.map(t => (
            <button key={t} onClick={() => setOrderType(t as typeof orderType)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all text-center"
              style={{
                cursor: 'pointer', fontFamily: 'inherit',
                background: orderType === t ? '#0F1F3D' : '#F7F6F3',
                color: orderType === t ? '#fff' : '#6B6860',
                border: `1.5px solid ${orderType === t ? '#0F1F3D' : '#E4E2DA'}`,
              }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {!cart.length ? (
            <div className="flex flex-col items-center justify-center h-full gap-2" style={{ color: '#A8A59E' }}>
              <div className="text-4xl">🛒</div>
              <div className="text-sm">Pilih produk dari daftar</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-2.5 p-2.5 rounded-[10px] mb-2"
              style={{ background: '#F7F6F3' }}>
              <span className="text-xl flex-shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{item.name}</div>
                <div className="text-[11px]" style={{ color: '#6B6860' }}>{item.unit} — {fmt(item.price)}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateCartQty(item.id, -1)}
                  className="w-6 h-6 rounded-md flex items-center justify-center border text-sm font-bold"
                  style={{ background: '#fff', border: '1px solid #D0CEC4', cursor: 'pointer' }}>
                  <Minus size={10} />
                </button>
                <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                <button onClick={() => updateCartQty(item.id, 1)}
                  className="w-6 h-6 rounded-md flex items-center justify-center border"
                  style={{ background: '#fff', border: '1px solid #D0CEC4', cursor: 'pointer' }}>
                  <Plus size={10} />
                </button>
              </div>
              <div className="text-sm font-bold min-w-[68px] text-right" style={{ color: '#2563EB' }}>
                {fmt(item.price * item.qty)}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t" style={{ borderColor: '#E4E2DA' }}>
          <input value={customerName} onChange={e => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-xs mb-2.5 outline-none border"
            style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }}
            placeholder="Nama pelanggan (opsional)" />

          <div className="flex gap-2 mb-3">
            <input type="number" value={discount || ''} onChange={e => setDiscount(+e.target.value)}
              className="flex-1 px-2.5 py-2 rounded-lg text-xs outline-none border"
              style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }} placeholder="Diskon (Rp)" />
            <input type="number" value={discountPct || ''} onChange={e => setDiscountPct(+e.target.value)}
              className="w-16 px-2.5 py-2 rounded-lg text-xs outline-none border text-center"
              style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }} placeholder="%" min={0} max={100} />
          </div>

          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {PAY_METHODS.map(m => (
              <button key={m} onClick={() => setPayMethod(m as typeof payMethod)}
                className="py-2 rounded-lg text-[11px] font-semibold text-center transition-all"
                style={{
                  cursor: 'pointer', fontFamily: 'inherit',
                  background: payMethod === m ? '#DBEAFE' : '#F7F6F3',
                  color: payMethod === m ? '#2563EB' : '#6B6860',
                  border: `1.5px solid ${payMethod === m ? '#2563EB' : '#E4E2DA'}`,
                }}>
                {m}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-sm mb-1.5" style={{ color: '#6B6860' }}>
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          {disc > 0 && (
            <div className="flex justify-between text-sm mb-1.5" style={{ color: '#DC2626' }}>
              <span>Diskon</span><span>- {fmt(disc)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm mb-1.5" style={{ color: '#6B6860' }}>
            <span>Pajak (11%)</span><span>{fmt(tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-3 mb-4 border-t" style={{ borderColor: '#E4E2DA' }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
          <button onClick={handlePay}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: '#0F1F3D', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <CreditCard size={15} /> Proses Pembayaran
          </button>
        </div>
      </div>

      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  )
}

function ProductCard({ product: p, onAdd }: { product: Product; onAdd: () => void }) {
  const isOut = p.stock === 0
  const isLow = p.stock > 0 && p.stock <= p.minStock
  return (
    <div onClick={() => !isOut && onAdd()}
      className="rounded-[14px] p-3.5 transition-all select-none"
      style={{
        background: '#fff', border: '1.5px solid #E4E2DA',
        cursor: isOut ? 'not-allowed' : 'pointer',
        opacity: isOut ? 0.6 : 1,
      }}
      onMouseEnter={e => { if (!isOut) { (e.currentTarget as HTMLElement).style.borderColor = '#2563EB'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px #DBEAFE' } }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E4E2DA'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
      <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl mb-2.5"
        style={{ background: isOut ? '#F1EFE8' : isLow ? '#FEF3C7' : '#EAF3DE' }}>
        {p.emoji}
      </div>
      <div className="text-sm font-bold mb-0.5">{p.name}</div>
      <div className="text-[11px] mb-2" style={{ color: isOut ? '#DC2626' : isLow ? '#D97706' : '#16A34A' }}>
        {isOut ? 'Habis' : isLow ? `Sisa ${p.stock}` : `Stok: ${p.stock}`}
      </div>
      <div className="text-sm font-bold" style={{ color: '#2563EB' }}>
        {fmt(p.price)} <span className="text-[10px] font-normal" style={{ color: '#A8A59E' }}>/ {p.unit}</span>
      </div>
    </div>
  )
}
