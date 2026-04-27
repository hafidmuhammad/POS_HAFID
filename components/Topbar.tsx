'use client'
import { useStore } from '@/lib/store'
import { ROLE_COLORS, ROLE_LABELS } from '@/lib/data'
import { Bell } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard', pos: 'Kasir / POS', online: 'Pesanan Online',
  orders: 'Semua Pesanan', stock: 'Manajemen Stok', users: 'Kelola User',
  reports: 'Laporan', settings: 'Pengaturan',
}

export default function Topbar() {
  const { currentUser, activePage } = useStore()
  if (!currentUser) return null
  const rc = ROLE_COLORS[currentUser.role]
  const now = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-7 py-3.5 border-b"
      style={{ background: '#fff', borderColor: '#E4E2DA' }}>
      <div className="text-lg font-bold" style={{ letterSpacing: '-0.3px' }}>
        {PAGE_TITLES[activePage] || ''}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: '#6B6860' }}>{now}</span>
        <div className="relative w-9 h-9 rounded-[9px] flex items-center justify-center cursor-pointer"
          style={{ background: '#F7F6F3', border: '1px solid #E4E2DA' }}>
          <Bell size={16} color="#6B6860" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white" style={{ background: '#DC2626' }} />
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: rc.bg, color: rc.text }}>
          {ROLE_LABELS[currentUser.role]}
        </span>
      </div>
    </div>
  )
}
