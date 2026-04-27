'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { fmt } from '@/lib/data'
import { Plus, Minus } from 'lucide-react'
import SuccessModal from '../modals/SuccessModal'

const ONLINE_PAY = ['Transfer', 'QRIS', 'COD'] as const
const DELIVERY = [
  { label: 'Ambil sendiri (gratis)', value: 0 },
  { label: 'Antar kurir (Rp 10.000)', value: 10000 },
  { label: 'Antar kurir jauh (Rp 20.000)', value: 20000 },
]

export default function OnlinePage() {
  const { products, onlineCart, addToOnlineCart, updateOnlineQty, clearOnlineCart,
    onlinePayMethod, setOnlinePayMethod, addOrder, currentUser, setLastOrder, showToast } = useStore()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [addr, setAddr] = useState('')
  const [shipping, setShipping] = useState(0)
  const [search, setSearch] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const sub = onlineCart.reduce((a, c) => a + c.price * c.qty, 0)
  const total = sub + shipping

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) { showToast('Nama & nomor WhatsApp wajib diisi!'); return }
    if (!onlineCart.length) { showToast('Pilih produk terlebih dahulu!'); return }
    const orderId = '#ORD-' + String(Math.floor(Math.random() * 9000) + 1000)
    const order = {
      id: orderId, customer: name, type: 'Online' as const,
      method: onlinePayMethod as typeof onlinePayMethod,
      total, subtotal: sub, discount: 0, tax: 0, shipping,
      status: 'pending' as const,
      items: onlineCart.map(c => ({ name: c.name + ' ' + c.unit, qty: c.qty, price: c.price })),
      date: new Date().toLocaleString('id-ID'),
      phone, address: addr, cashier: currentUser?.name,
    }
    addOrder(order)
    setLastOrder(order)
    clearOnlineCart()
    setName(''); setPhone(''); setAddr('')
    setShowSuccess(true)
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 flex gap-4 min-h-[calc(100vh-65px)]">
      {/* Products */}
      <div className="flex-1">
        <div className="mb-4">
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none border"
            style={{ border: '1.5px solid #E4E2DA', background: '#fff', fontFamily: 'inherit' }}
            placeholder="Cari produk..." />
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
          {filtered.map(p => (
            <div key={p.id} className="rounded-[14px] p-4 transition-all"
              style={{ background: '#fff', border: '1.5px solid #E4E2DA' }}>
              <div className="text-3xl mb-2.5">{p.emoji}</div>
              <div className="font-bold text-sm mb-1">{p.name}</div>
              <div className="text-xs mb-3" style={{ color: '#6B6860' }}>
                Stok: {p.stock} pcs · SKU: {p.sku}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-base" style={{ color: '#2563EB' }}>{fmt(p.price)}</div>
                  <div className="text-[10px]" style={{ color: '#A8A59E' }}>per {p.unit}</div>
                </div>
                <button onClick={() => { addToOnlineCart(p); showToast(`${p.emoji} ${p.name} ditambahkan`) }}
                  className="w-8 h-8 rounded-[9px] text-white flex items-center justify-center font-bold"
                  style={{ background: '#0F1F3D', border: 'none', cursor: 'pointer' }}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order form */}
      <div className="w-[320px] flex-shrink-0 rounded-[14px] overflow-hidden self-start sticky top-20"
        style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
        <div className="px-4 py-3.5 border-b font-bold text-sm" style={{ borderColor: '#E4E2DA' }}>
          Pesanan Online
        </div>
        <div className="p-4">
          {(['Nama Pemesan', 'No. WhatsApp'] as const).map((label, i) => (
            <div key={label} className="mb-3">
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>{label}</label>
              <input value={i === 0 ? name : phone} onChange={e => i === 0 ? setName(e.target.value) : setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }}
                placeholder={i === 0 ? 'Nama lengkap' : '08xxxxxxxx'} />
            </div>
          ))}
          <div className="mb-3">
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Alamat Pengiriman</label>
            <textarea value={addr} onChange={e => setAddr(e.target.value)} rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border resize-none"
              style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }}
              placeholder="Alamat lengkap..." />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Metode Pengiriman</label>
            <select value={shipping} onChange={e => setShipping(+e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border appearance-none"
              style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }}>
              {DELIVERY.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>

        {/* Cart items */}
        <div className="px-4 max-h-48 overflow-y-auto">
          {!onlineCart.length ? (
            <div className="text-center py-8 text-sm" style={{ color: '#A8A59E' }}>Belum ada produk dipilih</div>
          ) : onlineCart.map(item => (
            <div key={item.id} className="flex items-center gap-2 py-2 border-b" style={{ borderColor: '#E4E2DA' }}>
              <span className="text-lg flex-shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{item.name}</div>
                <div className="text-[10px]" style={{ color: '#6B6860' }}>{item.unit}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateOnlineQty(item.id, -1)}
                  className="w-5 h-5 rounded flex items-center justify-center border"
                  style={{ background: '#fff', border: '1px solid #D0CEC4', cursor: 'pointer' }}>
                  <Minus size={8} />
                </button>
                <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                <button onClick={() => updateOnlineQty(item.id, 1)}
                  className="w-5 h-5 rounded flex items-center justify-center border"
                  style={{ background: '#fff', border: '1px solid #D0CEC4', cursor: 'pointer' }}>
                  <Plus size={8} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {ONLINE_PAY.map(m => (
              <button key={m} onClick={() => setOnlinePayMethod(m)}
                className="py-2 rounded-lg text-xs font-semibold text-center"
                style={{
                  cursor: 'pointer', fontFamily: 'inherit',
                  background: onlinePayMethod === m ? '#DBEAFE' : '#F7F6F3',
                  color: onlinePayMethod === m ? '#2563EB' : '#6B6860',
                  border: `1.5px solid ${onlinePayMethod === m ? '#2563EB' : '#E4E2DA'}`,
                }}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm mb-1" style={{ color: '#6B6860' }}>
            <span>Subtotal</span><span>{fmt(sub)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3" style={{ color: '#6B6860' }}>
            <span>Ongkir</span><span>{fmt(shipping)}</span>
          </div>
          <div className="flex justify-between font-bold text-base mb-4 pt-3 border-t" style={{ borderColor: '#E4E2DA' }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
          <button onClick={handleSubmit}
            className="w-full py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: '#0F1F3D', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            Kirim Pesanan ke Kasir
          </button>
        </div>
      </div>

      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  )
}
