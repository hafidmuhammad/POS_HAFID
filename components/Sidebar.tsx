'use client'
import { useStore } from '@/lib/store'
import { NAV_CONFIG, ROLE_COLORS, ROLE_LABELS } from '@/lib/data'
import { NavPage } from '@/lib/data'
import * as Icons from 'lucide-react'
import { LucideIcon } from 'lucide-react'

function NavIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name]
  if (!Icon) return null
  return <Icon size={15} />
}

export default function Sidebar() {
  const { currentUser, activePage, setActivePage, logout } = useStore()
  if (!currentUser) return null

  const nav = NAV_CONFIG[currentUser.role]
  const rc = ROLE_COLORS[currentUser.role]
  const initials = currentUser.name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto"
      style={{ background: '#0F1F3D' }}>
      {/* Brand */}
      <div className="px-5 py-[18px] flex items-center gap-2.5 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: '#2563EB' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-none">SembakoPos</div>
          <div className="text-[10px] mt-0.5" style={{ color: '#475569' }}>v2.0</div>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-3.5 flex items-center gap-2.5 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: rc.bg, color: rc.text }}>
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold leading-none mb-0.5" style={{ color: '#E2E8F0' }}>{currentUser.name}</div>
          <div className="text-xs" style={{ color: '#64748B' }}>{ROLE_LABELS[currentUser.role]}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-3.5 flex-1">
        {nav.map((item, i) => {
          if (item.type === 'section') return (
            <div key={i} className="text-[10px] font-bold px-2 mt-4 mb-1.5 first:mt-0"
              style={{ color: '#334155', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              {item.label}
            </div>
          )
          const isActive = activePage === item.id
          const isDisabled = item.disabled
          return (
            <div key={item.id}
              onClick={() => !isDisabled && setActivePage(item.id as NavPage)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all"
              style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                color: isActive ? '#fff' : isDisabled ? '#334155' : '#94A3B8',
                background: isActive ? '#2563EB' : 'transparent',
                userSelect: 'none',
              }}
              onMouseEnter={e => { if (!isActive && !isDisabled) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              <NavIcon name={item.icon} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={{ background: '#DC2626', color: '#fff' }}>{item.badge}</span>
              )}
              {isDisabled && (
                <Icons.Lock size={11} style={{ color: '#334155' }} />
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/[0.07]">
        <button onClick={logout}
          className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          style={{ background: 'rgba(220,38,38,0.15)', color: '#FCA5A5', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.25)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.15)'}>
          <Icons.LogOut size={14} /> Keluar
        </button>
      </div>
    </aside>
  )
}
