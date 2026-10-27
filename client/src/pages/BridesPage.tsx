import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"

import type { Bride } from "../types/Bride"
import {
  createBride,
  deleteBrideApi,
  getBrides,
  
} from "../services/bridesApi"

import { AddBrideForm } from "../components/AddBrideForm"
import { BrideDetail } from "../components/BrideDetails"
import { RenderClasses } from "../components/renderClasses"
import { RenderSpecialization } from "../components/getSpecializations"
import { useAuth } from "../context/AuthContext"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  updateBrideApi,
  linkBrideUser,
  unlinkBrideUser,
} from "../services/bridesApi"

function BridesPage() {
  const queryClient = useQueryClient()
  const { token, selectedGroup } = useAuth()

  const [groupBy, setGroupBy] =
    useState<"class" | "specialization">("class")

  const [selectedBride, setSelectedBride] =
    useState<Bride | null>(null)

  const [searchText, setSearchText] = useState("")
  const [isAddBrideOpen, setIsAddBrideOpen] = useState(false)

  const {
    data: brides = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["brides", selectedGroup?.id],

    queryFn: () => {
      if (!token || !selectedGroup) {
        throw new Error("Missing token or selected group")
      }

      return getBrides(selectedGroup.id, token)
    },

    enabled: !!token && !!selectedGroup,
  })

  const addBrideMutation = useMutation({
mutationFn: async (data: Omit<Bride, "id">) => {
  if (!token || !selectedGroup) {
    throw new Error("Missing token or selected group")
  }

  const { linkedUserId, ...brideData } = data

  const createdBride = await createBride(
    selectedGroup.id,
    token,
    brideData
  )

  if (linkedUserId) {
    await linkBrideUser(
      selectedGroup.id,
      token,
      createdBride.id,
      linkedUserId
    )
  }

  return {
    ...createdBride,
    linkedUserId: linkedUserId ?? null,
  }
},

    onSuccess: (newBride) => {
      queryClient.setQueryData<Bride[]>(
        ["brides", selectedGroup?.id],
        (oldBrides) => {
          if (!oldBrides) return [newBride]

          return [...oldBrides, newBride]
        }
      )

      setIsAddBrideOpen(false)
      toast.success("הכלה נוספה בהצלחה")
    },

    onError: () => {
      toast.error("לא הצלחנו להוסיף את הכלה")
    },
  })

  const updateBrideMutation = useMutation({
   mutationFn: async (updatedBride: Bride) => {
  if (!token || !selectedGroup) {
    throw new Error("Missing token or selected group")
  }

  const oldLinkedUserId = selectedBride?.linkedUserId || null
  const newLinkedUserId = updatedBride.linkedUserId || null

  const result = await updateBrideApi(
    selectedGroup.id,
    token,
    updatedBride
  )


  if (oldLinkedUserId !== newLinkedUserId) {

  
    if (newLinkedUserId) {
      await linkBrideUser(
        selectedGroup.id,
        token,
        updatedBride.id,
        newLinkedUserId
      )
    }


    else {
      await unlinkBrideUser(
        selectedGroup.id,
        token,
        updatedBride.id
      )
    }
  }

  return {
    ...result,
    linkedUserId: newLinkedUserId,
  }
},

    onSuccess: (updatedBride) => {
      queryClient.setQueryData<Bride[]>(
        ["brides", selectedGroup?.id],
        (oldBrides) => {
          if (!oldBrides) return [updatedBride]

          return oldBrides.map((bride) =>
            bride.id === updatedBride.id
              ? updatedBride
              : bride
          )
        }
      )

      setSelectedBride(updatedBride)
      toast.success("פרטי הכלה עודכנו")
    },

    onError: () => {
      toast.error("לא הצלחנו לעדכן את פרטי הכלה")
    },
  })

  const deleteBrideMutation = useMutation({
    mutationFn: (brideId: number) => {
      if (!token || !selectedGroup) {
        throw new Error("Missing token or selected group")
      }

      return deleteBrideApi(
        selectedGroup.id,
        token,
        brideId
      )
    },

    onSuccess: (_, brideId) => {
      queryClient.setQueryData<Bride[]>(
        ["brides", selectedGroup?.id],
        (oldBrides) => {
          if (!oldBrides) return []

          return oldBrides.filter(
            (bride) => bride.id !== brideId
          )
        }
      )

      setSelectedBride(null)
      toast.success("הכלה נמחקה")
    },

    onError: () => {
      toast.error("לא הצלחנו למחוק את הכלה")
    },
  })

  if (!token) {
    return null
  }

  if (!selectedGroup) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-semibold">
            לא נבחרה קבוצה
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            בחרי קבוצה כדי לראות את רשימת הכלות.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <p className="text-muted-foreground">
          טוען כלות...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-semibold text-destructive">
            שגיאה בטעינת הכלות
          </p>
        </CardContent>
      </Card>
    )
  }

  const canAddBride =
    selectedGroup.role === "Admin" ||
    selectedGroup.role === "Contributor"

    const hasSearchResults = brides.some((bride) =>
  bride.brideFirstName.includes(searchText) ||
  bride.brideLastName.includes(searchText) ||
  bride.groomFirstName?.includes(searchText) ||
  bride.groomLastName.includes(searchText)
)

  return (
    <div className="space-y-8">

      {/* כותרת */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-brand-teal">
            הכלות בקבוצה
          </h1>

          <p className="mt-1 text-muted-foreground">
            {selectedGroup.name} · {brides.length} כלות
          </p>
        </div>

        {canAddBride && (
          <Button
            onClick={() => setIsAddBrideOpen(true)}
            className="bg-brand-coral text-white hover:bg-brand-coral/90"
          >
            <Plus />
            הוספת כלה
          </Button>
        )}
      </section>

      {/* חיפוש */}
<div className="relative max-w-xl">
  <Search
    className="
      absolute right-4 top-1/2
      size-4 -translate-y-1/2
      text-brand-teal/60
    "
  />

  <Input
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    placeholder="חפשי לפי שם הכלה או החתן..."
    className="
      h-11 rounded-xl
      border-brand-teal/20
      bg-white
      pr-11
      shadow-sm
      placeholder:text-muted-foreground/70
      focus-visible:border-brand-teal/50
      focus-visible:ring-brand-teal/15
    "
  />
</div>
{searchText && !hasSearchResults && (
  <div className="rounded-2xl bg-brand-pink/30 px-6 py-10 text-center">
    <p className="font-semibold text-brand-teal">
      לא נמצאו כלות שמתאימות לחיפוש
    </p>

    <p className="mt-1 text-sm text-muted-foreground">
      נסי לחפש בשם אחר.
    </p>
  </div>
)}
      {/* חלוקה */}
      <Tabs
        value={groupBy}
        onValueChange={(value) =>
          setGroupBy(
            value as "class" | "specialization"
          )
        }
        className="space-y-6"
      >
<TabsList className="h-auto rounded-xl bg-brand-pink/40 p-1">
  <TabsTrigger
    value="class"
    className="
      rounded-lg px-5 py-2
      font-semibold
      text-brand-teal/70
      data-[state=active]:bg-white
      data-[state=active]:text-brand-teal
      data-[state=active]:shadow-sm
    "
  >
    לפי כיתות
  </TabsTrigger>

  <TabsTrigger
    value="specialization"
    className="
      rounded-lg px-5 py-2
      font-semibold
      text-brand-teal/70
      data-[state=active]:bg-white
      data-[state=active]:text-brand-teal
      data-[state=active]:shadow-sm
    "
  >
    לפי התמחויות
  </TabsTrigger>
</TabsList>

        <TabsContent value="class">
          <RenderClasses
            brides={brides}
            onSelect={setSelectedBride}
            str={searchText}
          />
        </TabsContent>

        <TabsContent value="specialization">
          <RenderSpecialization
            brides={brides}
            onSelect={setSelectedBride}
            str={searchText}
          />
        </TabsContent>
      </Tabs>

      {/* הוספת כלה */}
      <Dialog
        open={isAddBrideOpen}
        onOpenChange={setIsAddBrideOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-brand-teal">
              הוספת כלה חדשה
            </DialogTitle>
          </DialogHeader>

          <AddBrideForm
            onAddBride={(bride) =>
              addBrideMutation.mutate(bride)
            }
          />
        </DialogContent>
      </Dialog>

      {/* פרטי כלה */}
      <Dialog
        open={!!selectedBride}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBride(null)
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-brand-teal">
              פרטי הכלה
            </DialogTitle>
          </DialogHeader>

          {selectedBride && (
            <BrideDetail
              bride={selectedBride}
              onClose={() => setSelectedBride(null)}
              onUpdate={(bride) =>
                updateBrideMutation.mutate(bride)
              }
              onDelete={(brideId) =>
                deleteBrideMutation.mutate(brideId)
              }
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default BridesPage