import { HDate } from "@hebcal/core"

export const formatHebrewDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)

  const value = new Date(year, month - 1, day)
  const hebrewDate = new HDate(value)

  return hebrewDate.renderGematriya()
}