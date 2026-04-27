'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { fmt } from '@/lib/data'
import { Package, AlertTriangle, Archive, X } from 'lucide-react'

export default function StockPage() {
  const { products, showToast } = useStore()
  const [search, setSearch] = useState('')
  const [showReceive, setShowReceive] = useState(false)
  const [showConvert, setShowConvert] = useState(false)

  // Receive form
  const [supplier, setSupplier] = useState('')
  const [recSacks, setRecSacks] = useState('')
  const [recWeight, setRecWeight] = useState('')

  // Convert form
  const [convSacks, setConvSacks] = useState('')
  const [convUnit, setConvUnit] = useState('1000')
  const [convActual, setConvActual] = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const totalProducts = products.length
  const lowStockCount = products.filter(p => p.stock <= p.minStock && p.stock > 0).length
  const outCount = products.filter(p => p.stock === 0).length
  const totalSacks = products.reduce((a, p) => a + p.bulkSack, 0)

  const convExpected = (+convSacks * 25 * 1000) / +convUnit
  const convActualPcs = +convActual > 0 ? Math.floor(+convActual * 1000 / +convUnit) : Math.floor(convExpected)
  const shrink = +convActual > 0 ? (((+convSacks * 25) - +convActual) / (+convSacks * 25) * 100).toFixed(2) : '0'

  const inputCls = {
    className: "w-full px-3 py-2 rounded-lg text-sm outline-none border",
    style: { border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }
  }

  return (
    <div className="p-7 animate-slide-up">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: Package, bg: '#EAF3DE', color: '#16A34A', label: 'Total Produk', val: totalProducts },
          { icon: AlertTriangle, bg: '#FEE2E2', color: '#DC2626', label: `Menipis / Habis`, val: `${lowStockCount} / ${outCount}` },
          { icon: Archive, bg: '#EDE9FE', color: '#7C3AED', label: 'Total Karung', val: totalSacks },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-[14px] px-4 py-3.5"
            style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: '#A8A59E' }}>{s.label}</div>
              <div className="text-xl font-bold">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none border"
          style={{ border: '1.5px solid #E4E2DA', background: '#fff', fontFamily: 'inherit' }}
          placeholder="Cari produk atau SKU..." />
        <button onClick={() => setShowReceive(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#0F1F3D', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Terima Barang
        </button>
        <button onClick={() => setShowConvert(true)}
          className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{ border: '1px solid #D0CEC4', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
          Konversi Satuan
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F7F6F3' }}>
                {['SKU', 'Produk', 'Stok Karung', 'Stok Eceran', 'Satuan Jual', 'Harga Jual', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left border-b text-[11px] font-bold uppercase tracking-wide"
                    style={{ color: '#6B6860', borderColor: '#E4E2DA' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const isOut = p.stock === 0
                const isLow = !isOut && p.stock <= p.minStock
                const s = isOut
                  ? { bg: '#FEE2E2', color: '#DC2626', label: 'Habis' }
                  : isLow
                    ? { bg: '#FEF3C7', color: '#D97706', label: 'Menipis' }
                    : { bg: '#DCFCE7', color: '#16A34A', label: 'Aman' }
                return (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-stone-50 transition-colors"
                    style={{ borderColor: '#E4E2DA' }}>
                    <td className="px-4 py-3 text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#2563EB' }}>{p.sku}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.emoji}</span>
                        <span className="font-semibold">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.bulkSack > 0 ? `${p.bulkSack} karung (${p.bulkKg} kg)` : '—'}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: isOut ? '#DC2626' : isLow ? '#D97706' : '#1A1916' }}>
                      {p.stock} pcs
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#6B6860' }}>{p.unit}</td>
                    <td className="px-4 py-3 font-bold">{fmt(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setShowConvert(true)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ border: '1px solid #D0CEC4', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Konversi
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Modal */}
      {showReceive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => e.target === e.currentTarget && setShowReceive(false)}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: '#fff' }}>
            <div className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: '#E4E2DA' }}>
              <div className="font-bold text-base">Terima Barang Masuk</div>
              <button onClick={() => setShowReceive(false)} className="w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer" style={{ border: '1px solid #E4E2DA', background: '#F7F6F3' }}><X size={14} /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Supplier</label>
                  <input {...inputCls} value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Nama supplier" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Produk</label>
                  <select {...inputCls} style={{ ...inputCls.style, appearance: 'none' }}>
                    {products.filter(p => p.bulkSack > 0).map(p => <option key={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Jumlah Karung</label>
                  <input {...inputCls} type="number" value={recSacks} onChange={e => setRecSacks(e.target.value)} placeholder="cth: 10" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Berat/Karung (kg)</label>
                  <input {...inputCls} type="number" value={recWeight} onChange={e => setRecWeight(e.target.value)} placeholder="cth: 25" />
                </div>
              </div>
              <div className="px-4 py-3 rounded-lg mb-4 text-sm font-semibold" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                Total berat diterima: {(+recSacks * +recWeight).toFixed(1)} kg
              </div>
            </div>
            <div className="px-6 py-4 flex gap-2 justify-end border-t" style={{ borderColor: '#E4E2DA' }}>
              <button onClick={() => setShowReceive(false)} className="px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer" style={{ fontFamily: 'inherit' }}>Batal</button>
              <button onClick={() => { setShowReceive(false); showToast('Stok berhasil diperbarui!') }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
                style={{ background: '#0F1F3D', border: 'none', fontFamily: 'inherit' }}>
                Simpan & Perbarui Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {showConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => e.target === e.currentTarget && setShowConvert(false)}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: '#fff' }}>
            <div className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: '#E4E2DA' }}>
              <div className="font-bold text-base">Konversi Karung → Eceran</div>
              <button onClick={() => setShowConvert(false)} className="w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer" style={{ border: '1px solid #E4E2DA', background: '#F7F6F3' }}><X size={14} /></button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Produk</label>
                <select {...inputCls} style={{ ...inputCls.style, appearance: 'none' }}>
                  {products.filter(p => p.bulkSack > 0).map(p => <option key={p.id} value={p.bulkKg / p.bulkSack}>{p.name} ({p.bulkKg / p.bulkSack}kg/karung)</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Jumlah Karung Dipecah</label>
                  <input {...inputCls} type="number" value={convSacks} onChange={e => setConvSacks(e.target.value)} placeholder="cth: 2" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Satuan Eceran</label>
                  <select {...inputCls} value={convUnit} onChange={e => setConvUnit(e.target.value)} style={{ ...inputCls.style, appearance: 'none' }}>
                    <option value="1000">1 kg</option>
                    <option value="500">500 gram</option>
                    <option value="250">250 gram</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Berat Aktual Timbang (kg)</label>
                  <input {...inputCls} type="number" value={convActual} onChange={e => setConvActual(e.target.value)} placeholder="Berat setelah timbang" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Hasil Eceran (perkiraan)</label>
                  <input {...inputCls} readOnly value={convActualPcs ? `${convActualPcs} pcs` : ''} style={{ ...inputCls.style, background: '#F7F6F3' }} />
                </div>
              </div>
              <div className="px-4 py-3 rounded-lg text-sm font-semibold"
                style={{ background: +shrink > 1 ? '#FEE2E2' : '#FEF3C7', color: +shrink > 1 ? '#DC2626' : '#D97706' }}>
                Susut: {shrink}% — {+shrink > 1 ? 'melebihi batas! Harap dicatat.' : 'dalam batas normal (<1%)'}
              </div>
            </div>
            <div className="px-6 py-4 flex gap-2 justify-end border-t" style={{ borderColor: '#E4E2DA' }}>
              <button onClick={() => setShowConvert(false)} className="px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer" style={{ fontFamily: 'inherit' }}>Batal</button>
              <button onClick={() => { setShowConvert(false); showToast('Konversi berhasil disimpan!') }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
                style={{ background: '#16A34A', border: 'none', fontFamily: 'inherit' }}>
                Konfirmasi Konversi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
