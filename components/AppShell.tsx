'use client'
import { useStore } from '@/lib/store'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Toast from './Toast'
import DashboardPage from './pages/DashboardPage'
import PosPage from './pages/PosPage'
import OnlinePage from './pages/OnlinePage'
import OrdersPage from './pages/OrdersPage'
import StockPage from './pages/StockPage'
import { UsersPage, ReportsPage, SettingsPage } from './pages/OtherPages'

export default function AppShell() {
  const activePage = useStore(s => s.activePage)

  const pages: Record<string, React.ReactNode> = {
    dashboard: <DashboardPage />,
    pos:       <PosPage />,
    online:    <OnlinePage />,
    orders:    <OrdersPage />,
    stock:     <StockPage />,
    users:     <UsersPage />,
    reports:   <ReportsPage />,
    settings:  <SettingsPage />,
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto" style={{ background: '#F7F6F3' }}>
          {pages[activePage] ?? <DashboardPage />}
        </main>
      </div>
      <Toast />
    </div>
  )
}
