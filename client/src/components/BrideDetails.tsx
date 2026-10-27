import { useState } from "react"
import type { Bride } from "../types/Bride"
import { formatHebrewDate } from "../utils/formatHebrewDate"
import { useAuth } from "../context/AuthContext"
import { sendBlessing } from "../services/blessingsApi"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getMembers } from "../services/membersApi"

import {
  CalendarDays,
  Send,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import EditBrideForm from "./EditBrideForm"

interface BrideDetailsProps {
  bride: Bride
  onClose: () => void
  onUpdate: (updatedBride: Bride) => void
  onDelete: (brideId: number) => void
}

export const BrideDetail = ({
  bride,
  onClose,
  onUpdate,
  onDelete,
}: BrideDetailsProps) => {
  const [date, setDate] = useState("")
  const [blessing, setBlessing] = useState("")

const [isEditing, setIsEditing] = useState(false)

  const [editingWeddingDate, setEditingWeddingDate] = useState(false)
    const {token,selectedGroup}=useAuth()
    const queryClient = useQueryClient();



if (!token) {
  return null
}

  const handleSendBlessing = async () => {
   if (!token || !selectedGroup) return
if (!blessing.trim()) return
  
    await sendBlessing(selectedGroup.id,token,bride.id ,blessing)
  
    queryClient.invalidateQueries({
      queryKey: ["blessing"]
    })
  
    setBlessing("")
  }
  const { data: members = [] } = useQuery({
  queryKey: ["members", selectedGroup?.id],
  queryFn: () => {
    if (!token || !selectedGroup) {
      throw new Error("Missing token or selected group")
    }

    return getMembers(selectedGroup.id, token)
  },
  enabled:
    !!token &&
    !!selectedGroup &&
    selectedGroup.role === "Admin",
})


return (
  <div className="space-y-6">

    {/* שם וסטטוס */}
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-brand-teal">
          {bride.brideFirstName} {bride.brideLastName}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {bride.groomFirstName} {bride.groomLastName}
        </p>
      </div>

      {bride.status && (
        <Badge className="bg-brand-pink text-brand-coral hover:bg-brand-pink">
          {bride.status}
        </Badge>
      )}
    </div>

    {/* פרטים */}
    <section className="rounded-2xl bg-muted/40 p-5">
      <h3 className="mb-4 font-bold">
        פרטים
      </h3>

      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">

        <div>
          <p className="text-xs text-muted-foreground">
            כיתה
          </p>
          <p className="mt-1 font-semibold">
            {bride.className || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            התמחות
          </p>
          <p className="mt-1 font-semibold">
            {bride.specialization || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            ישיבה
          </p>
          <p className="mt-1 font-semibold">
            {bride.yeshiva || "-"}
          </p>
        </div>

        {bride.weddingDate && (
          <div>
            <p className="text-xs text-muted-foreground">
              תאריך חתונה
            </p>

            <div className="mt-1 flex items-center gap-2 font-semibold">
              <CalendarDays className="size-4 text-brand-coral" />
              {formatHebrewDate(bride.weddingDate)}
            </div>
          </div>
        )}

      </div>
    </section>
{isEditing && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-teal">
          עריכת פרטי כלה
        </h2>

        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-xl text-muted-foreground"
        >
          ×
        </button>
      </div>

      <EditBrideForm
        bride={bride}
        onUpdateBride={(updatedBride) => {
          onUpdate(updatedBride)
          setIsEditing(false)
        }}
      />
    </div>
  </div>
)}
   
            {(selectedGroup?.role === "Admin" ||
  selectedGroup?.role === "Contributor") && (
  <button
    type="button"
    onClick={() => setIsEditing(true)}
    className="
      rounded-xl
      bg-brand-teal
      px-4 py-2
      font-semibold
      text-white
      transition
      hover:bg-brand-teal/90
    "
  >
    עריכת פרטים
  </button>
)}
       

    {/* ברכה */}
    <section className="space-y-3 rounded-2xl border bg-white p-5">
      <div>
        <h3 className="font-bold">
          שליחת ברכה
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          כתבי ברכה אישית
        </p>
      </div>

      <textarea
        placeholder={` ${bride.brideFirstName} היקרה`}
        onChange={(e) => setBlessing(e.target.value)}
        value={blessing}
        rows={4}
        className="
          w-full resize-none rounded-xl border
          bg-background px-4 py-3
          text-sm outline-none
          transition
          focus:border-brand-teal
          focus:ring-2
          focus:ring-brand-teal/15
        "
      />

      <Button
        onClick={handleSendBlessing}
        className="bg-brand-coral text-white hover:bg-brand-coral/90"
      >
        <Send />
        שליחת ברכה
      </Button>
    </section>

   

    {/* פעולות */}
    <div className="flex items-center justify-between border-t pt-5">

      {selectedGroup?.role === "Admin" ? (
        <Button
          variant="ghost"
          onClick={() => onDelete(bride.id)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 />
          מחיקה
        </Button>
      ) : (
        <div />
      )}

      <Button
        variant="outline"
        onClick={onClose}
      >
        סגור
      </Button>

    </div>

  </div>
)
}