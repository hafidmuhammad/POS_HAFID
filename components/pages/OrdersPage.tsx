'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { fmt } from '@/lib/data'
import { Order } from '@/lib/types'
import { Printer, ArrowRight } from 'lucide-react'
import InvoiceModal from '../modals/InvoiceModal'

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  paid:    { bg: '#DCFCE7', color: '#16A34A', label: 'Lunas' },
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'Menunggu' },
  process: { bg: '#DBEAFE', color: '#2563EB', label: 'Diproses' },
  cancel:  { bg: '#FEE2E2', color: '#DC2626', label: 'Dibatalkan' },
}
const TYPE_COLOR: Record<string, string> = { Online: '#2563EB', Tunai: '#0D9488', 'Staf Offline': '#D97706' }
type FilterType = 'all' | 'online' | 'offline' | 'pending'

export default function OrdersPage() {
  const { orders, loadCartFromOrder, setLastOrder, setShowInvoice, setActivePage } = useStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null)

  const filtered = orders.filter(o => {
    if (filter === 'online') return o.type === 'Online'
    if (filter === 'offline') return o.type === 'Tunai' || o.type === 'Staf Offline'
    if (filter === 'pending') return o.status === 'pending' || o.status === 'process'
    return true
  })

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Semua' }, { key: 'online', label: 'Online' },
    { key: 'offline', label: 'Offline' }, { key: 'pending', label: 'Menunggu' },
  ]

  return (
    <div className="p-7 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                cursor: 'pointer', fontFamily: 'inherit',
                background: filter === f.key ? '#0F1F3D' : '#fff',
                color: filter === f.key ? '#fff' : '#6B6860',
                border: `1px solid ${filter === f.key ? '#0F1F3D' : '#E4E2DA'}`,
              }}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => setActivePage('pos')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#0F1F3D', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Transaksi Baru
        </button>
      </div>

      <div className="rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F7F6F3' }}>
                {['ID Order', 'Pelanggan', 'Tipe', 'Metode Bayar', 'Total', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left border-b text-[11px] font-bold uppercase tracking-wide"
                    style={{ color: '#6B6860', borderColor: '#E4E2DA' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const s = STATUS_STYLE[o.status]
                const canProcess = o.status === 'pending' || o.status === 'process'
                return (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-stone-50 transition-colors"
                    style={{ borderColor: '#E4E2DA' }}>
                    <td className="px-4 py-3 text-xs font-medium" style={{ fontFamily: 'DM Mono, monospace', color: '#2563EB' }}>{o.id}</td>
                    <td className="px-4 py-3 font-semibold">{o.customer}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: TYPE_COLOR[o.type] + '20', color: TYPE_COLOR[o.type] }}>
                        {o.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#6B6860' }}>{o.method || '-'}</td>
                    <td className="px-4 py-3 font-bold">{fmt(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setInvoiceOrder(o)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{ border: '1px solid #D0CEC4', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                          <Printer size={11} /> Invoice
                        </button>
                        {canProcess && (
                          <button onClick={() => loadCartFromOrder(o.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white"
                            style={{ background: '#16A34A', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                            <ArrowRight size={11} /> Proses ke Kasir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {invoiceOrder && <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
    </div>
  )
}
