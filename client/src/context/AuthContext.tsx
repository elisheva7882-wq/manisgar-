import { createContext, useContext, useState, type ReactNode } from "react"

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
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
const userFromStorage = localStorage.getItem("user")
const [user, setUser] = useState<User | null>(
  userFromStorage ? JSON.parse(userFromStorage) : null
)  
const selectedGroupFromStorage = localStorage.getItem("group")

const[selectedGroup,setSelectedGroup]=useState<Group|null>(
  selectedGroupFromStorage? JSON.parse(selectedGroupFromStorage) : null
)

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