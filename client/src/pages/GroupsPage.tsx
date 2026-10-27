import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/context/AuthContext"
import { createGroup, getGroups, joinGroup, leaveGroup } from "@/services/groupsApi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { CopyIcon } from "lucide-react"
export function GroupsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { token, selectGroup,clearSelectedGroup,selectedGroup } = useAuth()

  const [groupCode, setGroupCode] = useState("")
  const [groupName, setGroupName] = useState("")
  const [groupToLeave, setGroupToLeave] = useState<string | null>(null)

  const {
    data: groups = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: () => {
      if (!token) {
        throw new Error("No token")
      }

      return getGroups(token)
    },
    enabled: token !== null,
  })

const handleJoinGroup = async () => {
  if (!token || !groupCode.trim()) return

  try {
    await joinGroup(token, groupCode.trim())

    await queryClient.invalidateQueries({
      queryKey: ["groups"],
    })

    setGroupCode("")

    toast.success("הצטרפת לקבוצה בהצלחה")
  } catch (error) {
    console.error(error)

    toast.error("לא הצלחנו להצטרף לקבוצה. בדקי שהקוד תקין.")
  }
}

const handleCreateGroup = async () => {
  if (!token || !groupName.trim()) return

  try {
    await createGroup(token, groupName.trim())

    await queryClient.invalidateQueries({
      queryKey: ["groups"],
    })

    setGroupName("")

    toast.success("הקבוצה נוצרה בהצלחה")
  } catch (error) {
    console.error(error)

    toast.error("לא הצלחנו ליצור את הקבוצה")
  }
}






const handleLeaveGroup = async (groupId:string) => {
  if (!token) return

  try {
    await leaveGroup(groupId,token)

    await queryClient.invalidateQueries({
      queryKey: ["groups"],
    })
if (selectedGroup?.id === groupId) {
  clearSelectedGroup()
}
    toast.success("עזבת את הקובצה בהצלחה!")
  } catch (error) {
    console.error(error)

    toast.error("לא הצלחת לעזוב את הקבוצה")
  }
}

const handleCopyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    toast.success("קוד הקבוצה הועתק")
  } catch {
    toast.error("לא הצלחנו להעתיק את הקוד")
  }
}

  if (error) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="py-8 text-center">
          <p className="font-semibold text-destructive">
            שגיאה בטעינת הקבוצות
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-10">

      {/* כותרת העמוד */}
      <section>
        <h1 className="text-3xl font-bold text-brand-teal">
          הקבוצות שלי
        </h1>

        <p className="mt-2 text-muted-foreground">
          כאן אפשר להצטרף לקבוצה, ליצור קבוצה חדשה ולבחור קבוצה להמשך.
        </p>
      </section>

      {/* הצטרפות / יצירה */}
      <section className="grid gap-6 md:grid-cols-2">

        {/* הצטרפות לקבוצה */}
        <Card className="border-brand-pink shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">
              הצטרפות לקבוצה
            </CardTitle>

            <CardDescription>
              קיבלת קוד מחברה? הזיני אותו כאן והצטרפי לקבוצה.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Input
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              placeholder="הזיני קוד קבוצה"
              className="text-right"
            />
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleJoinGroup}
              disabled={!groupCode.trim()}
              className="w-full"
            >
              הצטרפות לקבוצה
            </Button>
          </CardFooter>
        </Card>

        {/* יצירת קבוצה */}
        <Card className="border-brand-pink shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">
              יצירת קבוצה חדשה
            </CardTitle>

            <CardDescription>
              פותחת קבוצה חדשה? תני לה שם ואפשר להתחיל.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="הזיני שם קבוצה"
              className="text-right"
            />
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleCreateGroup}
              disabled={!groupName.trim()}
              className="w-full bg-brand-coral text-white hover:bg-brand-coral/90"
            >
              יצירת קבוצה
            </Button>
          </CardFooter>
        </Card>

      </section>

      {/* רשימת קבוצות */}
      <section className="space-y-5">

        <div>
          <h2 className="text-2xl font-bold">
            הקבוצות שלך
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            בחרי קבוצה כדי לראות את הכלות והעדכונים שלה.
          </p>
        </div>

        {groups.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="font-semibold">
                עדיין אין לך קבוצות
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                אפשר להצטרף לקבוצה קיימת או ליצור קבוצה חדשה.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Card
                key={group.id}
                className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <CardTitle className="text-xl">
                        {group.name}
                      </CardTitle>

                      <CardDescription className="mt-1">
                        {group.role === "Admin"
                          ? "מנהלת הקבוצה"
                          : "חברת קבוצה"}
                      </CardDescription>
                    </div>

                    <span
                      className={
                        group.role === "Admin"
                          ? "rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold text-foreground"
                          : "rounded-full bg-brand-pink px-3 py-1 text-xs font-semibold text-brand-teal"
                      }
                    >
                      {group.role === "Admin" ? "מנהלת" : "חברה"}
                    </span>

                  </div>
                </CardHeader>

                <CardContent>
                  {group.role === "Admin" && (
                    <div className="rounded-xl bg-brand-pink/50 p-4">
  <p className="text-xs text-muted-foreground">
    קוד הצטרפות לקבוצה
  </p>

  <div className="mt-2 flex items-center justify-between gap-3">
    <p className="text-lg font-bold tracking-wider text-brand-teal">
      {group.joinCode}
    </p>

    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => handleCopyCode(group.joinCode)}
      aria-label="העתקת קוד הקבוצה"
      className="text-brand-teal hover:bg-white/70"
    >
      <CopyIcon />
    </Button>
  </div>
</div>
                  )}
                </CardContent>

               <CardFooter className="flex gap-2">
  <Button
    className="flex-1"
    onClick={() => {
      selectGroup(group)
      navigate("/brides")
    }}
  >
    כניסה לקבוצה
  </Button>

  {group.role !== "Admin" && (
    <button
      type="button"
      onClick={() => setGroupToLeave(group.id)}
      className="
        rounded-xl
        border border-brand-coral/30
        px-4 py-2
        text-sm font-semibold
        text-brand-coral
        transition
        hover:bg-brand-coral/10
      "
    >
      יציאה
    </button>
  )}
</CardFooter>
 
              </Card>
            ))}
          </div>
        )}

      </section>
      {groupToLeave && (
  <div
    className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/30
      p-4
    "
  >
    <div
      className="
        w-full max-w-md
        rounded-2xl
        bg-white
        p-6
        shadow-xl
      "
    >
      <h2 className="text-xl font-bold text-brand-teal">
        לצאת מהקבוצה?
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        לאחר היציאה לא תוכלי לראות את נתוני הקבוצה,
        אלא אם תצטרפי אליה מחדש.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setGroupToLeave(null)}
          className="
            rounded-xl
            border border-brand-teal/20
            px-4 py-2
            text-sm font-semibold
            text-brand-teal
            transition
            hover:bg-brand-teal/5
          "
        >
          ביטול
        </button>

        <button
          type="button"
          onClick={async () => {
            await handleLeaveGroup(groupToLeave)
            setGroupToLeave(null)
          }}
          className="
            rounded-xl
            bg-brand-coral
            px-4 py-2
            text-sm font-semibold
            text-white
            transition
            hover:opacity-90
          "
        >
          כן, לצאת
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}