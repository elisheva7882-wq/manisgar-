import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  fullName: string
}

interface Group {
  id: string
  joinCode: string
  name: string
  role: string
}
interface AuthContextType {
  token: string | null
  user: User | null
  loginUser: (token: string, user: User) => void
  logoutUser: () => void
  selectedGroup:Group|null
  selectGroup:(group:Group)=>void
  clearSelectedGroup: () => void
}


interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
const userFromStorage = localStorage.getItem("user")
const [user, setUser] = useState<User | null>(
  userFromStorage ? JSON.parse(userFromStorage) : null
)  
const selectedGroupFromStorage = localStorage.getItem("group")

const[selectedGroup,setSelectedGroup]=useState<Group|null>(
  selectedGroupFromStorage? JSON.parse(selectedGroupFromStorage) : null
)

  useEffect(() => {
    if (!token) return

    let expiresAt = 0
    try {
      const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
      const { exp } = JSON.parse(atob(payload))
      if (typeof exp === "number" && Number.isFinite(exp)) {
        expiresAt = exp * 1000
      }
    } catch {
      // An unreadable token requires a fresh login.
    }

    let expired = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const checkExpiration = () => {
      if (expired) return
      if (timer !== undefined) clearTimeout(timer)

      const remaining = expiresAt - Date.now()
      if (remaining > 0) {
        timer = setTimeout(checkExpiration, Math.min(remaining, 2_147_483_647))
        return
      }

      expired = true
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("group")
      setToken(null)
      setUser(null)
      setSelectedGroup(null)
      queryClient.clear()
      toast.error("תוקף ההתחברות פג. התחברי מחדש.", { id: "session-expired" })
      navigate("/login", { replace: true })
    }

    checkExpiration()
    window.addEventListener("focus", checkExpiration)
    document.addEventListener("visibilitychange", checkExpiration)

    return () => {
      if (timer !== undefined) clearTimeout(timer)
      window.removeEventListener("focus", checkExpiration)
      document.removeEventListener("visibilitychange", checkExpiration)
    }
  }, [token, navigate, queryClient])

  const selectGroup=(group:Group)=>{
    localStorage.setItem('group',JSON.stringify(group))
  setSelectedGroup(group)
  }

  const loginUser = (token: string, user: User) => {
    localStorage.setItem('token',token)
    localStorage.setItem('user',JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('group')
    setToken(null)
    setUser(null)
    setSelectedGroup(null)
  }
  const clearSelectedGroup = () => {
  localStorage.removeItem("group")
  setSelectedGroup(null)
}

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loginUser,
        logoutUser,
        selectedGroup,
        selectGroup,
        clearSelectedGroup
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
