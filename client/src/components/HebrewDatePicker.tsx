
import { useState } from "react"
import { DayPicker } from "@daypicker/hebrew"
import { HDate, gematriya } from "@hebcal/core"
import { CalendarDays } from "lucide-react"
import "@daypicker/react/style.css"
interface HebrewDatePickerProps {
  value: string
  onChange: (value: string) => void
}

export function HebrewDatePicker({
  value,
  onChange,
}: HebrewDatePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = value
    ? (() => {
        const [year, month, day] = value.split("-").map(Number)
        return new Date(year, month - 1, day)
      })()
    : undefined

  const handleSelect = (date: Date | undefined) => {
    if (!date) return

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    onChange(`${year}-${month}-${day}`)
    setOpen(false)
  }

  return (
    <div className="relative max-w-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-xl border bg-background px-3 text-sm"
      >
        <span>
          {selected
            ? new HDate(selected).renderGematriya()
            : "בחרי תאריך עברי"}
        </span>
        <CalendarDays className="h-4 w-4 text-brand-teal" />
      </button>

      {open && (
        <div
          dir="rtl"
          className="absolute right-0 z-50 mt-2 w-max max-w-[calc(100vw-2rem)] rounded-2xl border bg-background p-3 shadow-xl"
        >
          <DayPicker
  mode="single"
  selected={selected}
  onSelect={handleSelect}
  defaultMonth={selected ?? new Date()}
  captionLayout="dropdown"
  dir="rtl"
  formatters={{
    formatDay: (date) =>
      gematriya(new HDate(date).getDate()),

    formatYearDropdown: (date) =>
      gematriya(new HDate(date).getFullYear()),
  }}
/>
        </div>
      )}
    </div>
  )
}
