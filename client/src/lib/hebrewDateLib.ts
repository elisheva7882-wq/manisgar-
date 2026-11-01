import { HDate } from "@hebcal/core"
import type { DateLib } from "@daypicker/react"

// DayPicker indexes months from Tishrei; Hebcal numbers them from Nisan.
function monthIndex(date: HDate) {
  const month = date.getMonth()
  return month >= 7 ? month - 7 : month + HDate.monthsInYear(date.getFullYear()) - 7
}

function newDate(year: number, index: number, day: number) {
  const first = new HDate(1, 7, year).add(index, "month")
  return new HDate(day, first.getMonth(), first.getFullYear()).greg()
}

function setYear(date: Date, year: number) {
  const current = new HDate(date)
  let month = current.getMonth()
  if (month === 13 && !HDate.isLeapYear(year)) month = 12
  if (month === 12 && !current.isLeapYear() && HDate.isLeapYear(year)) month = 13
  return new HDate(Math.min(current.getDate(), HDate.daysInMonth(month, year)), month, year).greg()
}

function startOfMonth(date: Date) {
  const current = new HDate(date)
  return new HDate(1, current.getMonth(), current.getFullYear()).greg()
}

function endOfMonth(date: Date) {
  const current = new HDate(date)
  const result = new HDate(current.daysInMonth(), current.getMonth(), current.getFullYear()).greg()
  result.setHours(23, 59, 59, 999)
  return result
}

function monthSerial(date: HDate) {
  const year = date.getFullYear()
  return Math.floor((235 * year - 234) / 19) + monthIndex(date)
}

export const hebrewDateLib: Partial<DateLib> = {
  newDate,
  getMonth: (date) => monthIndex(new HDate(date)),
  getYear: (date) => new HDate(date).getFullYear(),
  startOfMonth,
  endOfMonth,
  startOfYear: (date) => new HDate(1, 7, new HDate(date).getFullYear()).greg(),
  endOfYear: (date) => endOfMonth(new HDate(1, 6, new HDate(date).getFullYear()).greg()),
  addMonths: (date, amount) => new HDate(date).add(amount, "month").greg(),
  addYears: (date, amount) => setYear(date, new HDate(date).getFullYear() + amount),
  setMonth: (date, index) => {
    const current = new HDate(date)
    const target = new HDate(newDate(current.getFullYear(), index, 1))
    return new HDate(Math.min(current.getDate(), target.daysInMonth()), target.getMonth(), target.getFullYear()).greg()
  },
  setYear,
  isSameMonth: (left, right) => monthSerial(new HDate(left)) === monthSerial(new HDate(right)),
  isSameYear: (left, right) => new HDate(left).getFullYear() === new HDate(right).getFullYear(),
  differenceInCalendarMonths: (left, right) => monthSerial(new HDate(left)) - monthSerial(new HDate(right)),
  eachMonthOfInterval: ({ start, end }) => {
    const last = new Date(end)
    const result: Date[] = []
    if (new Date(start) > last) return result
    let current = new HDate(startOfMonth(new Date(start)))
    while (current.greg() <= last) {
      result.push(current.greg())
      current = current.add(1, "month")
    }
    return result
  },
  eachYearOfInterval: ({ start, end }) => {
    const result: Date[] = []
    if (new Date(start) > new Date(end)) return result
    for (let year = new HDate(new Date(start)).getFullYear(); year <= new HDate(new Date(end)).getFullYear(); year++) {
      result.push(new HDate(1, 7, year).greg())
    }
    return result
  },
}
