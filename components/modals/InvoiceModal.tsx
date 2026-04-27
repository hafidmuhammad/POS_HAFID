'use client'
import { Order } from '@/lib/types'
import { useStore } from '@/lib/store'
import { fmt } from '@/lib/data'
import { Printer, X } from 'lucide-react'

export default function InvoiceModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const { currentUser } = useStore()

  const handlePrint = () => {
    const w = window.open('', '_blank', 'width=800,height=900')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head>
      <title>Invoice ${order.id}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #1A1916; font-size: 13px; }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #0F1F3D; }
        .brand h1 { font-size: 24px; font-weight: 800; color: #0F1F3D; letter-spacing: -1px; }
        .brand p { font-size: 11px; color: #6B6860; margin-top: 2px; }
        .inv-info { text-align: right; }
        .inv-info h2 { font-size: 20px; font-weight: 800; color: #0F1F3D; letter-spacing: 2px; }
        .inv-info p { font-size: 11px; color: #6B6860; margin-top: 2px; }
        .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 28px; }
        .party h4 { font-size: 10px; font-weight: 700; color: #A8A59E; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
        .party p { font-size: 13px; margin-bottom: 3px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        thead th { padding: 10px 14px; background: #0F1F3D; color: #fff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
        tbody td { padding: 10px 14px; border-bottom: 1px solid #E4E2DA; font-size: 13px; }
        tbody tr:nth-child(even) td { background: #F7F6F3; }
        .totals { max-width: 280px; margin-left: auto; margin-bottom: 32px; }
        .total-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 13px; border-bottom: 1px solid #E4E2DA; }
        .total-row.grand { font-size: 16px; font-weight: 800; border-bottom: none; color: #0F1F3D; padding-top: 12px; }
        .footer { border-top: 1px solid #E4E2DA; padding-top: 20px; display: flex; justify-content: space-between; }
        .sign { text-align: center; }
        .sign-line { width: 160px; border-bottom: 1px solid #1A1916; margin: 50px auto 8px; }
        .sign p { font-size: 12px; font-weight: 600; }
        @media print { @page { margin: 20mm; } }
      </style>
    </head><body>
      <div class="header">
        <div class="brand"><h1>SembakoPos</h1><p>Toko Sembako Makmur</p><p>Jl. Raya Utama No. 45, Jakarta Selatan</p><p>Telp: 0812-3456-7890</p></div>
        <div class="inv-info"><h2>INVOICE</h2><p><strong>No:</strong> ${order.id}</p><p><strong>Tanggal:</strong> ${order.date}</p><p><strong>Tipe:</strong> ${order.type}</p><p><strong>Bayar:</strong> ${order.method}</p></div>
      </div>
      <div class="parties">
        <div class="party"><h4>Kepada</h4><p><strong>${order.customer}</strong></p>${order.phone ? `<p>WA: ${order.phone}</p>` : ''}${order.address ? `<p>${order.address}</p>` : ''}</div>
        <div class="party"><h4>Dilayani Oleh</h4><p><strong>${currentUser?.name || 'Sistem'}</strong></p><p>${currentUser ? '' : ''}</p></div>
      </div>
      <table>
        <thead><tr><th>Produk</th><th style="text-align:center">Qty</th><th style="text-align:right">Harga Satuan</th><th style="text-align:right">Subtotal</th></tr></thead>
        <tbody>${order.items.map(i => `<tr><td>${i.name}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">${fmt(i.price)}</td><td style="text-align:right;font-weight:700">${fmt(i.price * i.qty)}</td></tr>`).join('')}</tbody>
      </table>
      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>${fmt(order.subtotal)}</span></div>
        ${order.discount ? `<div class="total-row" style="color:#DC2626"><span>Diskon</span><span>- ${fmt(order.discount)}</span></div>` : ''}
        ${order.shipping ? `<div class="total-row"><span>Ongkir</span><span>${fmt(order.shipping)}</span></div>` : ''}
        ${order.tax ? `<div class="total-row"><span>Pajak (11%)</span><span>${fmt(order.tax)}</span></div>` : ''}
        <div class="total-row grand"><span>TOTAL</span><span>${fmt(order.total)}</span></div>
      </div>
      <div class="footer">
        <div><p style="font-weight:600;margin-bottom:4px">Pembayaran via:</p><p>BCA 1234567890 — Toko Sembako Makmur</p><p style="margin-top:12px;font-size:11px;color:#6B6860">Terima kasih atas pembelian Anda!</p><p style="font-size:11px;color:#6B6860">Barang yang sudah dibeli tidak dapat dikembalikan.</p></div>
        <div class="sign"><div class="sign-line"></div><p>Kasir / Petugas</p><p style="font-size:11px;color:#6B6860;margin-top:4px">${currentUser?.name || ''}</p></div>
      </div>
      <script>window.onload=()=>{ window.print(); }</script>
    </body></html>`)
    w.document.close()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto" style={{ background: '#fff' }}>
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: '#E4E2DA' }}>
          <div className="font-bold text-base">Preview Invoice</div>
          <div className="flex gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
              style={{ background: '#0F1F3D', border: 'none', fontFamily: 'inherit' }}>
              <Printer size={14} /> Cetak Invoice
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer"
              style={{ border: '1px solid #E4E2DA', background: '#F7F6F3' }}><X size={14} /></button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="p-8" style={{ background: '#fff' }}>
          <div className="flex justify-between items-start mb-8 pb-6" style={{ borderBottom: '2px solid #0F1F3D' }}>
            <div>
              <div className="text-2xl font-black" style={{ color: '#0F1F3D', letterSpacing: '-1px' }}>SembakoPos</div>
              <div className="text-xs mt-1" style={{ color: '#6B6860' }}>Toko Sembako Makmur</div>
              <div className="text-xs" style={{ color: '#6B6860' }}>Jl. Raya Utama No. 45, Jakarta Selatan</div>
              <div className="text-xs" style={{ color: '#6B6860' }}>Telp: 0812-3456-7890</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black mb-1" style={{ color: '#0F1F3D', letterSpacing: '2px' }}>INVOICE</div>
              <div className="text-xs" style={{ color: '#6B6860' }}>No: <strong>{order.id}</strong></div>
              <div className="text-xs" style={{ color: '#6B6860' }}>Tanggal: {order.date}</div>
              <div className="text-xs" style={{ color: '#6B6860' }}>Tipe: {order.type}</div>
              <div className="text-xs" style={{ color: '#6B6860' }}>Bayar: {order.method}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#A8A59E' }}>Kepada</div>
              <div className="font-bold">{order.customer}</div>
              {order.phone && <div className="text-sm" style={{ color: '#6B6860' }}>WA: {order.phone}</div>}
              {order.address && <div className="text-sm" style={{ color: '#6B6860' }}>{order.address}</div>}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#A8A59E' }}>Dilayani Oleh</div>
              <div className="font-bold">{currentUser?.name || 'Sistem'}</div>
            </div>
          </div>

          <table className="w-full mb-6 text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Produk', 'Qty', 'Harga Satuan', 'Subtotal'].map(h => (
                  <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-white"
                    style={{ background: '#0F1F3D', textAlign: h === 'Qty' || h === 'Harga Satuan' || h === 'Subtotal' ? 'right' as const : 'left' as const }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} style={{ background: i % 2 === 1 ? '#F7F6F3' : '#fff', borderBottom: '1px solid #E4E2DA' }}>
                  <td className="px-3.5 py-2.5">{item.name}</td>
                  <td className="px-3.5 py-2.5 text-center">{item.qty}</td>
                  <td className="px-3.5 py-2.5 text-right">{fmt(item.price)}</td>
                  <td className="px-3.5 py-2.5 text-right font-bold">{fmt(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ml-auto max-w-[260px] mb-8">
            {[
              { label: 'Subtotal', val: order.subtotal, color: '' },
              order.discount ? { label: 'Diskon', val: -order.discount, color: '#DC2626' } : null,
              order.shipping ? { label: 'Ongkir', val: order.shipping, color: '' } : null,
              order.tax ? { label: 'Pajak (11%)', val: order.tax, color: '' } : null,
            ].filter(Boolean).map((r, i) => (
              <div key={i} className="flex justify-between py-2 border-b text-sm" style={{ borderColor: '#E4E2DA', color: r!.color || '#1A1916' }}>
                <span>{r!.label}</span><span>{r!.val < 0 ? '- ' + fmt(-r!.val) : fmt(r!.val)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 font-black text-base" style={{ color: '#0F1F3D' }}>
              <span>TOTAL</span><span>{fmt(order.total)}</span>
            </div>
          </div>

          <div className="flex justify-between pt-5" style={{ borderTop: '1px solid #E4E2DA' }}>
            <div>
              <div className="text-sm font-semibold mb-1">Pembayaran via:</div>
              <div className="text-xs" style={{ color: '#6B6860' }}>BCA 1234567890 — Toko Sembako Makmur</div>
              <div className="text-xs mt-3" style={{ color: '#6B6860' }}>Terima kasih atas pembelian Anda!</div>
              <div className="text-xs" style={{ color: '#6B6860' }}>Barang yang sudah dibeli tidak dapat dikembalikan.</div>
            </div>
            <div className="text-center">
              <div style={{ width: 160, borderBottom: '1px solid #1A1916', marginBottom: 8, marginTop: 56 }} />
              <div className="text-xs font-semibold">Kasir / Petugas</div>
              <div className="text-[11px]" style={{ color: '#6B6860' }}>{currentUser?.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
