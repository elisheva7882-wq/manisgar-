import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBrides } from "../services/bridesApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WeddingPopup } from "./WeddingPopup";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
function Header(){
    const{token, user,selectedGroup,logoutUser}=useAuth()
    const navigate=useNavigate()
const [showUserMenu, setShowUserMenu] = useState(false)
    const { isLoading,data: brides = [] } = useQuery({
  queryKey: ["brides", selectedGroup?.id],
  queryFn: () => {
    if (!token || !selectedGroup) {
      throw new Error("Missing token or selected group")
    }

    return getBrides(selectedGroup.id, token)
  },
  enabled: !!token && !!selectedGroup,
})
const isBride = brides.some(
  (bride) => bride.linkedUserId === user?.id
)
const handleLogout=()=>{
  logoutUser()
   navigate('/login')
}





   const d = new Date();
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
 const weddingsToday= brides.filter((bride)=>{
return bride.weddingDate?.slice(0, 10)===today
  })
const [showWeddingPopup, setShowWeddingPopup] = useState(false)
useEffect(() => {
  if (!isLoading && weddingsToday.length > 0) {
    setShowWeddingPopup(true)
  }
}, [isLoading, weddingsToday.length])



const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-brand-pink text-brand-teal"
      : "text-foreground hover:bg-muted hover:text-brand-teal"
  }`;

return (
  <>
    {showWeddingPopup && (
      <WeddingPopup
        weddingsToday={weddingsToday}
        onClose={() => setShowWeddingPopup(false)}
      />
    )}

    <header className="sticky top-0 z-50 border-b bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6">

        {/* Logo */}
        <NavLink to="/groups" className="shrink-0">
          <img
            src={logo}
            alt="מה נסגר?"
            className="h-16 w-auto object-contain"
          />
        </NavLink>

        {/* Navigation */}
        {/* <nav className="flex flex-1 items-center justify-center gap-1">
          <NavLink to="/groups" className={navLinkClass}>
            הקבוצות שלי
          </NavLink> */}

          {selectedGroup && (
            <>
              <NavLink to="/brides" className={navLinkClass}>
                כלות
              </NavLink>

              <NavLink to="/calendar" className={navLinkClass}>
                לוח חתונות
              </NavLink>

              <NavLink to="/statistic" className={navLinkClass}>
                סטטיסטיקות
              </NavLink>

              {/* {selectedGroup.role === "Admin" && (
                <NavLink to="/group-settings" className={navLinkClass}>
                  הגדרות קבוצה
                </NavLink>
              )} */}

              {isBride && (
                <NavLink to="/my-blessings" className={navLinkClass}>
                  הברכות שלי
                </NavLink>
              )}
            </>
          )}
        {/* </nav> */}

        {/* User */}
       {/* User menu */}
<div className="relative shrink-0">
  <button
    type="button"
    onClick={() => setShowUserMenu(!showUserMenu)}
    className="
      flex items-center gap-3
      rounded-xl
      px-3 py-2
      text-right
      transition
      hover:bg-brand-pink/30
    "
  >
    <div
      className="
        flex h-10 w-10
        items-center justify-center
        rounded-full
        bg-brand-teal
        text-lg font-bold
        text-white
      "
    >
      {user?.fullName?.charAt(0)}
    </div>

    <div>
      <div className="font-semibold text-foreground">
        {user?.fullName}
      </div>

      {selectedGroup && (
        <div className="text-xs text-muted-foreground">
          {selectedGroup.name}
        </div>
      )}
    </div>

    <span
      className={`text-xs text-muted-foreground transition-transform ${
        showUserMenu ? "rotate-180" : ""
      }`}
    >
      ▼
    </span>
  </button>

  {showUserMenu && (
    <div
      className="
        absolute left-0 top-full
        mt-2 w-56
        overflow-hidden
        rounded-2xl
        border border-brand-teal/10
        bg-white
        p-2
        shadow-lg
      "
    >
      <NavLink
        to="/groups"
        onClick={() => setShowUserMenu(false)}
        className="
          block rounded-xl
          px-4 py-3
          text-sm font-semibold
          text-foreground
          transition
          hover:bg-brand-pink/30
          hover:text-brand-teal
        "
      >
        הקבוצות שלי
      </NavLink>

      {selectedGroup?.role === "Admin" && (
        <NavLink
          to="/group-settings"
          onClick={() => setShowUserMenu(false)}
          className="
            block rounded-xl
            px-4 py-3
            text-sm font-semibold
            text-foreground
            transition
            hover:bg-brand-pink/30
            hover:text-brand-teal
          "
        >
          הגדרות הקבוצה
        </NavLink>
      )}

      <div className="my-1 border-t border-brand-teal/10" />

      <button
        type="button"
        onClick={handleLogout}
        className="
          w-full rounded-xl
          px-4 py-3
          text-right
          text-sm font-semibold
          text-brand-coral
          transition
          hover:bg-brand-coral/10
        "
      >
        התנתקות
      </button>
    </div>
  )}
</div>

      </div>
    </header>
  </>
);
}

export default Header
