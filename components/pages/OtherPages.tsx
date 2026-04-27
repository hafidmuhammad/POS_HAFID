'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { ROLE_COLORS, ROLE_LABELS, fmt } from '@/lib/data'
import { Role } from '@/lib/types'
import { X } from 'lucide-react'

// ── USERS PAGE ──
export function UsersPage() {
  const { users, addUser, toggleUserStatus } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<Role>('kasir')
  const [phone, setPhone] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    addUser({ id: Date.now().toString(), name, username, role, phone, status: 'aktif', lastLogin: '-' })
    setShowModal(false); setName(''); setUsername(''); setPhone('')
  }

  return (
    <div className="p-7 animate-slide-up">
      <div className="flex justify-end mb-5">
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#0F1F3D', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Tambah User
        </button>
      </div>
      <div className="rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F7F6F3' }}>
              {['Nama', 'Username', 'Role', 'Status', 'Terakhir Login', 'Aksi'].map(h => (
                <th key={h} className="px-4 py-3 text-left border-b text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: '#6B6860', borderColor: '#E4E2DA' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const rc = ROLE_COLORS[u.role]
              return (
                <tr key={u.id} className="border-b last:border-0 hover:bg-stone-50 transition-colors" style={{ borderColor: '#E4E2DA' }}>
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#2563EB' }}>{u.username}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: rc.bg, color: rc.text }}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: u.status === 'aktif' ? '#DCFCE7' : '#FEE2E2', color: u.status === 'aktif' ? '#16A34A' : '#DC2626' }}>
                      {u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#6B6860' }}>{u.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer" style={{ fontFamily: 'inherit' }}>Edit</button>
                      {u.username !== 'superadmin' && (
                        <button onClick={() => toggleUserStatus(u.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                          style={{ border: `1px solid ${u.status === 'aktif' ? '#DC2626' : '#16A34A'}`, color: u.status === 'aktif' ? '#DC2626' : '#16A34A', background: 'transparent', fontFamily: 'inherit' }}>
                          {u.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl" style={{ background: '#fff' }}>
            <div className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: '#E4E2DA' }}>
              <div className="font-bold text-base">Tambah User Baru</div>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer" style={{ border: '1px solid #E4E2DA', background: '#F7F6F3' }}><X size={14} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Nama Lengkap', val: name, set: setName, ph: 'Nama lengkap' },
                { label: 'Username', val: username, set: setUsername, ph: 'Username login' },
                { label: 'No. Telepon', val: phone, set: setPhone, ph: '08xxxxxxxxxx' },
              ].map(f => (
                <div key={f.label} className={f.label === 'No. Telepon' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>{f.label}</label>
                  <input value={f.val} onChange={e => f.set(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                    style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }} placeholder={f.ph} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>Role</label>
                <select value={role} onChange={e => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border appearance-none"
                  style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }}>
                  {(['manager', 'kasir', 'gudang', 'owner'] as Role[]).map(r => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-2 justify-end border-t" style={{ borderColor: '#E4E2DA' }}>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer" style={{ fontFamily: 'inherit' }}>Batal</button>
              <button onClick={handleAdd} className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
                style={{ background: '#0F1F3D', border: 'none', fontFamily: 'inherit' }}>Tambah User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── REPORTS PAGE ──
export function ReportsPage() {
  const today = new Date().toISOString().split('T')[0]
  return (
    <div className="p-7 animate-slide-up">
      <div className="flex gap-2 mb-6 items-center">
        <input type="date" defaultValue={today} className="px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }} />
        <span style={{ color: '#6B6860' }}>s/d</span>
        <input type="date" defaultValue={today} className="px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }} />
        <button className="px-4 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer" style={{ fontFamily: 'inherit' }}>Terapkan</button>
        <button onClick={() => window.print()} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer"
          style={{ background: '#0F1F3D', border: 'none', fontFamily: 'inherit' }}>Export PDF</button>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {[
          { label: 'Total Omzet', val: 'Rp 128 Jt', sub: 'Bulan ini' },
          { label: 'Total Transaksi', val: '1.248', sub: 'Bulan ini' },
          { label: 'Rata-rata/Hari', val: 'Rp 4,1 Jt', sub: 'Per hari kerja' },
          { label: 'Item Terjual', val: '8.724', sub: 'Total item' },
        ].map((s, i) => (
          <div key={i} className="rounded-[14px] p-5" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
            <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: '#A8A59E' }}>{s.label}</div>
            <div className="text-2xl font-bold mb-1" style={{ letterSpacing: '-0.5px', color: i === 0 ? '#2563EB' : '#1A1916' }}>{s.val}</div>
            <div className="text-xs" style={{ color: '#6B6860' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-[14px]" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
          <div className="px-5 py-4 border-b font-bold text-sm" style={{ borderColor: '#E4E2DA' }}>Produk Terlaris</div>
          <div className="p-5">
            {[
              { name: '🌾 Beras Premium 1kg', qty: 842, rev: 12600000 },
              { name: '🧴 Minyak Goreng 1L', qty: 631, rev: 8800000 },
              { name: '🍬 Gula Pasir 1kg', qty: 524, rev: 6300000 },
              { name: '⚪ Tepung Terigu 500g', qty: 318, rev: 3200000 },
            ].map((p, i) => (
              <div key={i} className="flex items-center py-2.5 border-b last:border-0" style={{ borderColor: '#E4E2DA' }}>
                <div className="flex-1 text-sm">{p.name}</div>
                <div className="font-bold text-sm mr-4">{p.qty} pcs</div>
                <div className="font-bold text-sm" style={{ color: '#2563EB' }}>{fmt(p.rev)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[14px]" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
          <div className="px-5 py-4 border-b font-bold text-sm" style={{ borderColor: '#E4E2DA' }}>Performa Kasir</div>
          <div className="p-5 flex flex-col gap-4">
            {[
              { name: 'Rina Kasir', amount: 48000000, pct: 80, color: '#2563EB' },
              { name: 'Doni Staf', amount: 35000000, pct: 58, color: '#0D9488' },
              { name: 'Siti Kasir', amount: 28000000, pct: 46, color: '#D97706' },
            ].map((k, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{k.name}</span>
                  <span className="font-bold" style={{ color: k.color }}>{fmt(k.amount)}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#F1EFE8' }}>
                  <div className="h-full rounded-full" style={{ width: `${k.pct}%`, background: k.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SETTINGS PAGE ──
export function SettingsPage() {
  const { showToast } = useStore()
  return (
    <div className="p-7 animate-slide-up">
      <div className="max-w-2xl flex flex-col gap-4">
        {[
          {
            title: 'Informasi Toko',
            fields: [
              { label: 'Nama Toko', val: 'Toko Sembako Makmur', full: false },
              { label: 'No. Telepon', val: '0812-3456-7890', full: false },
              { label: 'Alamat', val: 'Jl. Raya Utama No. 45, Jakarta Selatan', full: true, textarea: true },
              { label: 'Pajak (%)', val: '11', full: false },
              { label: 'Mata Uang', val: 'IDR - Rupiah', full: false },
            ]
          },
          {
            title: 'Konfigurasi Invoice',
            fields: [
              { label: 'Footer Invoice', val: 'Terima kasih atas pembelian Anda! Barang yang sudah dibeli tidak dapat dikembalikan.', full: true, textarea: true },
              { label: 'Rekening Bank', val: 'BCA 1234567890 — Toko Sembako Makmur', full: true },
            ]
          },
        ].map(section => (
          <div key={section.title} className="rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E2DA' }}>
            <div className="px-6 py-4 border-b font-bold text-sm" style={{ borderColor: '#E4E2DA' }}>{section.title}</div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {section.fields.map(f => (
                  <div key={f.label} className={f.full ? 'col-span-2' : ''}>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6B6860' }}>{f.label}</label>
                    {f.textarea ? (
                      <textarea defaultValue={f.val} rows={2}
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none border resize-none"
                        style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }} />
                    ) : (
                      <input defaultValue={f.val} className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                        style={{ border: '1.5px solid #E4E2DA', fontFamily: 'inherit' }} />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => showToast('Perubahan berhasil disimpan!')}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
                style={{ background: '#0F1F3D', border: 'none', fontFamily: 'inherit' }}>
                Simpan Perubahan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
