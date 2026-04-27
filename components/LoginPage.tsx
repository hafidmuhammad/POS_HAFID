'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { ROLE_LABELS } from '@/lib/data'
import { Role } from '@/lib/types'

const ROLE_NAMES: Record<Role, string> = {
  superadmin: 'Admin Utama',
  manager:    'Budi Manager',
  kasir:      'Rina Kasir',
  gudang:     'Doni Gudang',
  owner:      'Pak Owner',
}

const HINTS: { role: Role; pass: string }[] = [
  { role: 'superadmin', pass: 'admin123' },
  { role: 'manager',    pass: 'manager123' },
  { role: 'kasir',      pass: 'kasir123' },
  { role: 'gudang',     pass: 'gudang123' },
  { role: 'owner',      pass: 'owner123' },
]

export default function LoginPage() {
  const login = useStore(s => s.login)
  const showToast = useStore(s => s.showToast)
  const [username, setUsername] = useState('superadmin')
  const [password, setPassword] = useState('admin123')
  const [role, setRole] = useState<Role>('superadmin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login gagal.')
        setLoading(false)
        return
      }
      login({ name: data.user.name, username: data.user.username, role: data.user.role })
    } catch {
      setError('Tidak dapat terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0F1F3D' }}>
      {/* Art Panel */}
      <div className="flex-1 flex flex-col justify-center px-14 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 60% 50%, #2563EB, transparent)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#2563EB' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none">SembakoPos</div>
              <div className="text-xs mt-0.5" style={{ color: '#475569' }}>Sistem Manajemen Toko</div>
            </div>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-4" style={{ color: '#fff', letterSpacing: '-1.5px' }}>
            Kelola toko<br/>lebih <span style={{ color: '#60A5FA' }}>cerdas</span><br/>& efisien.
          </h1>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: '#94A3B8' }}>
            Sistem POS terintegrasi dengan manajemen gudang, pesanan online, konversi satuan karung, dan laporan real-time.
          </p>
          <div className="flex gap-2 mt-10">
            {['POS Kasir', 'Gudang', 'Online Order', 'Invoice'].map((tag, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Login Panel */}
      <div className="w-[420px] flex-shrink-0 flex flex-col justify-center px-12 py-10"
        style={{ background: '#fff' }}>
        <h2 className="text-2xl font-bold mb-1" style={{ letterSpacing: '-0.5px' }}>Selamat datang</h2>
        <p className="text-sm mb-8" style={{ color: '#6B6860' }}>Masuk untuk mengakses sistem sesuai peran Anda</p>

        <div className="mb-4">
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none border-[1.5px] transition-all"
            style={{ border: '1.5px solid #E4E2DA', background: '#F7F6F3', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E4E2DA'}
            placeholder="Username" />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none border-[1.5px]"
            style={{ border: '1.5px solid #E4E2DA', background: '#F7F6F3', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E4E2DA'}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Masuk sebagai</label>
          <select value={role} onChange={e => setRole(e.target.value as Role)}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none border-[1.5px] cursor-pointer appearance-none"
            style={{ border: '1.5px solid #E4E2DA', background: '#F7F6F3', fontFamily: 'inherit' }}>
            <option value="superadmin">Super Admin</option>
            <option value="manager">Manager</option>
            <option value="kasir">Kasir</option>
            <option value="gudang">Staff Gudang</option>
            <option value="owner">Owner / Pemilik</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-lg text-sm font-medium" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={loading}
          className="w-full py-3 rounded-lg font-bold text-sm text-white transition-all"
          style={{ background: loading ? '#475569' : '#0F1F3D', fontFamily: 'inherit' }}>
          {loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
        </button>

        <div className="mt-5 p-3.5 rounded-lg" style={{ background: '#F7F6F3', border: '1px solid #E4E2DA' }}>
          <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: '#6B6860' }}>Akun Demo</p>
          {HINTS.map(h => (
            <div key={h.role} className="flex items-center gap-2 mb-1 cursor-pointer"
              onClick={() => { setUsername(h.role); setPassword(h.pass); setRole(h.role) }}>
              <span className="text-xs font-semibold min-w-[110px]">{ROLE_LABELS[h.role]}</span>
              <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#2563EB' }}>{h.pass}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
