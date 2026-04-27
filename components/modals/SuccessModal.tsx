'use client'
import { useStore } from '@/lib/store'
import { fmt } from '@/lib/data'
import { CheckCircle, Printer, X } from 'lucide-react'
import { useState } from 'react'
import InvoiceModal from './InvoiceModal'

export default function SuccessModal({ onClose }: { onClose: () => void }) {
  const { lastOrder } = useStore()
  const [showInvoice, setShowInvoice] = useState(false)

  if (!lastOrder) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="w-full max-w-sm rounded-2xl overflow-hidden text-center animate-slide-up"
          style={{ background: '#fff' }}>
          <div className="px-6 py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#DCFCE7' }}>
              <CheckCircle size={32} color="#16A34A" />
            </div>
            <div className="text-xl font-bold mb-1.5">Pembayaran Berhasil!</div>
            <div className="text-sm mb-1" style={{ color: '#6B6860' }}>
              {lastOrder.id} — {lastOrder.customer}
            </div>
            <div className="text-sm mb-4" style={{ color: '#6B6860' }}>
              {lastOrder.type} · {lastOrder.method}
            </div>
            <div className="text-3xl font-black mb-6" style={{ color: '#2563EB', letterSpacing: '-1px' }}>
              {fmt(lastOrder.total)}
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer"
                style={{ fontFamily: 'inherit' }}>
                Tutup
              </button>
              <button onClick={() => { onClose(); setShowInvoice(true) }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: '#0F1F3D', border: 'none', fontFamily: 'inherit' }}>
                <Printer size={14} /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {showInvoice && lastOrder && (
        <InvoiceModal order={lastOrder} onClose={() => setShowInvoice(false)} />
      )}
    </>
  )
}
