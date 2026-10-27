import { useState } from "react"
import { HDate, Locale, gematriya } from "@hebcal/core"
import { useAuth } from "../context/AuthContext"
import { getBrides } from "../services/bridesApi"
import { useQuery } from "@tanstack/react-query"
import type { Bride } from "../types/Bride"
import { formatHebrewDate } from "../utils/formatHebrewDate"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function CalendarPage() {
  const today = new HDate()

  const { token, selectedGroup } = useAuth()

  const { data: brides = [] } = useQuery({
    queryKey: ["brides", selectedGroup?.id],
    queryFn: () => {
      if (!token || !selectedGroup) {
        throw new Error("Missing token or selected group")
      }

      return getBrides(selectedGroup.id, token)
    },
    enabled: !!token && !!selectedGroup,
  })

  const bridesWithWeddingDate = brides.filter(
    (bride) => bride.weddingDate
  )

  const [displayDate, setDisplayDate] = useState(
    () => new HDate(1, today.getMonth(), today.getFullYear())
  )

  const year = displayDate.getFullYear()
  const month = displayDate.getMonth()

  const monthName = Locale.gettext(
    displayDate.getMonthName(),
    "he-x-NoNikud"
  )

  const daysInMonth = displayDate.daysInMonth()

  const firstDayOfWeek = displayDate.getDay()

  const days = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1
  )

  const weekDays = [
    "א׳",
    "ב׳",
    "ג׳",
    "ד׳",
    "ה׳",
    "ו׳",
    "שבת",
  ]

  const nextMonth = () => {
    setDisplayDate((currentDate) => {
      return new HDate(
        currentDate.abs() + currentDate.daysInMonth()
      )
    })
  }

  const previousMonth = () => {
    setDisplayDate((currentDate) => {
      const lastDayPreviousMonth = new HDate(
        currentDate.abs() - 1
      )

      return new HDate(
        1,
        lastDayPreviousMonth.getMonth(),
        lastDayPreviousMonth.getFullYear()
      )
    })
  }
  const[selectedBride,setSelectedBride]=useState<Bride|null>(null)
  return (

<div dir="rtl" className="space-y-6">
      
       <Dialog
  open={!!selectedBride}
  onOpenChange={(open) => {
    if (!open) {
      setSelectedBride(null)
    }
  }}
>
  {selectedBride && (
    <DialogContent dir="rtl" className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-brand-teal">
          💍 {selectedBride.brideFirstName} {selectedBride.brideLastName}
          {" - "}
          {selectedBride.groomLastName}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-2">

        <div>
          <p className="text-xs text-muted-foreground">
            סטטוס
          </p>
          <p className="mt-1 font-semibold">
            {selectedBride.status || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            כיתה
          </p>
          <p className="mt-1 font-semibold">
            {selectedBride.className || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            התמחות
          </p>
          <p className="mt-1 font-semibold">
            {selectedBride.specialization || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            ישיבה
          </p>
          <p className="mt-1 font-semibold">
            {selectedBride.yeshiva || "-"}
          </p>
        </div>

      </div>

      <div className="rounded-2xl bg-brand-pink/25 p-4">
        <h3 className="mb-3 font-bold text-brand-teal">
          פרטי החתונה
        </h3>

        <div className="space-y-2 text-sm">

          {selectedBride.weddingDate && (
            <p>
              <span className="font-semibold">תאריך: </span>
              {formatHebrewDate(selectedBride.weddingDate)}
            </p>
          )}

          {selectedBride.weddingTime && (
            <p>
              <span className="font-semibold">שעה: </span>
              {selectedBride.weddingTime}
            </p>
          )}

          {selectedBride.weddingHall && (
            <p>
              <span className="font-semibold">אולם: </span>
              {selectedBride.weddingHall}
            </p>
          )}

          {selectedBride.weddingCity && (
            <p>
              <span className="font-semibold">עיר: </span>
              {selectedBride.weddingCity}
            </p>
          )}

        </div>
      </div>
    </DialogContent>
  )}
</Dialog>
<div className="mb-6 flex items-center justify-between">
<button
  onClick={previousMonth}
  className="
    flex items-center gap-1
    rounded-xl border border-brand-teal/20
    bg-white px-3 py-2
    font-semibold text-brand-teal
    shadow-sm transition
    hover:bg-brand-pink/30
  "
>
  <ChevronRight className="size-4" />
  הקודם
</button>

  <div className="text-center">
    <p className="text-sm text-muted-foreground">
      לוח חתונות
    </p>

    <h1 className="text-2xl font-bold text-brand-teal">
      {monthName} {gematriya(year)}
    </h1>
  </div>

 <button
  onClick={nextMonth}
  className="
    flex items-center gap-1
    rounded-xl border border-brand-teal/20
    bg-white px-3 py-2
    font-semibold text-brand-teal
    shadow-sm transition
    hover:bg-brand-pink/30
  "
>
  הבא
  <ChevronLeft className="size-4" />
</button>
</div>

  <div className="overflow-x-auto rounded-2xl border border-brand-teal/15 bg-white shadow-sm">
  <div className="grid min-w-[700px] grid-cols-7 md:min-w-0">
     {weekDays.map((day) => (
  <div
    key={day}
    className="
      border-b border-brand-teal/10
      bg-brand-pink/30
      py-3 text-center
      font-semibold text-brand-teal
    "
  >
    {day}
  </div>
))}
       {Array.from({ length: firstDayOfWeek }).map(
  (_, index) => (
    <div
      key={`empty-${index}`}
      className="
        min-h-28
        border-b border-l border-brand-teal/10
        bg-brand-pink/5
      "
    />
  )
)}

        {days.map((day) => {
          const hebrewDate = new HDate(day, month, year)
          const isToday =
  day === today.getDate() &&
  month === today.getMonth() &&
  year === today.getFullYear()
          const gregorianDate = hebrewDate.greg()

          const gregorianDateString =
            `${gregorianDate.getFullYear()}-` +
            `${String(
              gregorianDate.getMonth() + 1
            ).padStart(2, "0")}-` +
            `${String(
              gregorianDate.getDate()
            ).padStart(2, "0")}`

          const weddingsToday =
            bridesWithWeddingDate.filter(
              (bride) =>
                bride.weddingDate?.slice(0, 10) ===
                gregorianDateString
            )

          return (
            
           <div
  key={day}
  className="
    min-h-28
    border-b border-l border-brand-teal/10
    bg-white
    p-3
    transition
    hover:bg-brand-pink/10
  "
>
<div
  className={`
    mb-2 flex size-8 items-center justify-center
    rounded-full font-semibold
    ${
      isToday
        ? "bg-brand-teal text-white"
        : "text-brand-teal"
    }
  `}
>
  {gematriya(day)}
</div>
              {weddingsToday.map((bride) => (
  <button
    key={bride.id}
    onClick={() => setSelectedBride(bride)}
    className="
      mb-1 w-full
      rounded-lg
      bg-brand-coral/15
      px-2 py-1.5
      text-right text-xs font-semibold
      text-brand-teal
      transition
      hover:bg-brand-coral/25
    "
  >
    💍 {bride.brideFirstName} {bride.brideLastName}-{bride.groomLastName}
  </button>
))}
            </div>
          )
        })}
      </div>
    </div>
          </div>
   
  )
}

export default CalendarPage