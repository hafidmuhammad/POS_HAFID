'use client'
import { useStore } from '@/lib/store'
import LoginPage from '@/components/LoginPage'
import AppShell from '@/components/AppShell'

export default function Home() {
  const currentUser = useStore(s => s.currentUser)
  return currentUser ? <AppShell /> : <LoginPage />
}
