
import Header from './components/Header'
import BridesPage from './pages/BridesPage'
import CalendarPage from './pages/CalendarPage'
import GroupSetting from './pages/GroupSettingsPage'
import { GroupsPage } from './pages/GroupsPage'
import { LoginPage } from './pages/LoginPage'
import MyBlessings from './pages/MyBlessingsPage'
import { RegisterPage } from './pages/RegisterPage'
import{Routes,Route}from'react-router-dom'
import StatisticsPage from './pages/StatisticsPage'
import { useAuth } from './context/AuthContext'
import { Toaster } from "@/components/ui/sonner"
function App() {

const{token}=useAuth()

  return (
    
<>
  {token && <Header />}

  <main
    className={
      token
        ? "mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        : ""
    }
  >
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/brides" element={<BridesPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/group-settings" element={<GroupSetting />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/my-blessings" element={<MyBlessings />} />
      <Route path="/statistic" element={<StatisticsPage />} />
    </Routes>
  </main>


  <Toaster position="top-center" richColors />
</>

  )
}

export default App
