import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../context/AuthContext"
import { getMyBlessings } from "../services/blessingsApi"
import { formatHebrewDate } from "@/utils/formatHebrewDate"

function MyBlessings(){

const { token,selectedGroup} = useAuth()

const { 
  data: myBlessings = [], 
  isLoading,
  error
} = useQuery({
  queryKey:["myBlessings", selectedGroup?.id],
  queryFn: () =>{
    if(!token || !selectedGroup) {
          throw new Error("Missing token or selected group")
        }
    
        return getMyBlessings(selectedGroup.id, token)
    },
     enabled: !!token && !!selectedGroup,
})

if (isLoading) {
  return <div>טוען...</div>
}

if (error) {
  return <div>שגיאה בטעינת הברכות</div>
}
return (
  <div dir="rtl" className="space-y-6">

    <section>
      <h1 className="text-3xl font-bold text-brand-teal">
        הברכות שלי
      </h1>

      <p className="mt-2 text-muted-foreground">
        כל הברכות שקיבלת מחברות הקבוצה במקום אחד 💌
      </p>
    </section>

    <div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {myBlessings.map((bles) => (
    <div
      key={bles.id}
      className="
        rounded-2xl
        border border-brand-teal/10
        bg-white
        p-5
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            ברכה מאת
          </p>

          <h3 className="font-bold text-brand-teal">
            {bles.senderName}
          </h3>
        </div>

        <div
          className="
            flex size-10 items-center justify-center
            rounded-full
            bg-brand-pink/40
            text-lg
          "
        >
          💌
        </div>
      </div>

      <p className="leading-7 text-foreground">
        {bles.content}
      </p>

      <div className="mt-5 border-t border-brand-teal/10 pt-3">
        <p className="text-xs text-muted-foreground">
          {formatHebrewDate(bles.createdAtUtc.split("T")[0])}
        </p>
      </div>
    </div>
  ))}
</div>
    </div>

  </div>
)
}

export default MyBlessings