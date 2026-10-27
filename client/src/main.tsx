import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import{BrowserRouter} from 'react-router-dom'
import { DirectionProvider } from "@/components/ui/direction"
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <AuthProvider>
        <DirectionProvider direction="rtl">
  <App />
</DirectionProvider>
      </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
