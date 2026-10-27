export type Bride = {
  id: number
  brideFirstName: string
brideLastName: string
groomFirstName?: string | null
groomLastName: string
  className: string
  specialization: string
  status: "מאורסת" | "נשואה"
  yeshiva: string

  weddingDate?: string | null
  weddingTime?: string | null
  weddingHall?: string | null
  weddingCity?: string | null

  linkedUserId?: string | null
}