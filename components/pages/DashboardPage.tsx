'use client'
import { useStore } from '@/lib/store'
import { fmt } from '@/lib/data'
import { TrendingUp, ShoppingBag, Truck, AlertTriangle } from 'lucide-react'

const STATS = [
  { label: 'Omzet Hari Ini', value: 'Rp 4,2 Jt', sub: '+12% dari kemarin', icon: TrendingUp, iconBg: '#DBEAFE', iconColor: '#2563EB' },
  { label: 'Total Transaksi', value: '87', sub: '34 online · 53 offline', icon: ShoppingBag, iconBg: '#DCFCE7', iconColor: '#16A34A' },
  { label: 'Pesanan Diantar', value: '23', sub: '5 dalam perjalanan', icon: Truck, iconBg: '#FEF3C7', iconColor: '#D97706' },
  { label: 'Stok Menipis', value: '6', sub: 'Perlu segera diisi', icon: AlertTriangle, iconBg: '#FEE2E2', iconColor: '#DC2626' },
]

const STATUS_STYLE: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  process: 'bg-blue-100 text-blue-700',
  cancel: 'bg-red-100 text-red-700',
}
const STATUS_LABEL: Record<string, string> = {
  paid: 'Lunas', pending: 'Menunggu', process: 'Diproses', cancel: 'Dibatalkan',
}

export default function DashboardPage() {
  const { orders, products, setActivePage } = useStore()
  const recent = orders.slice(0, 5)
  const lowStock = products.filter(p => p.stock <= p.minStock)

  return (
    <div className="p-7 animate-slide-up">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {STATS.map((s, i) => (
          <div key={i} className="rounded-[14px] p-5" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#A8A59E' }}>{s.label}</div>
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: s.iconBg }}>
                <s.icon size={16} color={s.iconColor} />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ letterSpacing: '-0.5px' }}>{s.value}</div>
            <div className="text-xs" style={{ color: '#6B6860' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        {/* Recent Orders */}
        <div className="rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: '#E4E2DA' }}>
            <div className="font-bold text-sm">Transaksi Terbaru</div>
            <button onClick={() => setActivePage('orders')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{ border: '1px solid #D0CEC4', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
              Lihat semua
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#F7F6F3' }}>
                  {['ID Order', 'Pelanggan', 'Tipe', 'Total', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide border-b"
                      style={{ color: '#6B6860', borderColor: '#E4E2DA' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(o => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-stone-50 transition-colors" style={{ borderColor: '#E4E2DA' }}>
                    <td className="px-4 py-3 text-xs font-medium" style={{ fontFamily: 'DM Mono, monospace', color: '#2563EB' }}>{o.id}</td>
                    <td className="px-4 py-3 font-medium">{o.customer}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#6B6860' }}>{o.type}</td>
                    <td className="px-4 py-3 font-bold">{fmt(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[o.status]}`}>
                        {STATUS_LABEL[o.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-[14px]" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
          <div className="px-5 py-4 border-b font-bold text-sm" style={{ borderColor: '#E4E2DA' }}>
            Peringatan Stok
          </div>
          <div className="p-4 flex flex-col gap-0">
            {lowStock.map(p => {
              const isOut = p.stock === 0
              return (
                <div key={p.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: '#E4E2DA' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: isOut ? '#DC2626' : '#D97706' }} />
                  <div>
                    <div className="text-sm font-semibold">{p.name} {p.unit}</div>
                    <div className="text-xs" style={{ color: isOut ? '#DC2626' : '#D97706' }}>
                      {isOut ? 'Habis!' : `Sisa ${p.stock} pcs — menipis`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
