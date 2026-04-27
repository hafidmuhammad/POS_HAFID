'use client'
import { useStore } from '@/lib/store'
import { useEffect, useState } from 'react'

export default function Toast() {
  const toast = useStore(s => s.toast)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (toast) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [toast])

  if (!toast && !visible) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300"
      style={{
        background: '#0F1F3D',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
      }}>
      {toast}
    </div>
  )
}
