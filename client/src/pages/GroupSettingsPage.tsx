import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../context/AuthContext"
import { addClass, deleteClass, getClasses } from "../services/classesApi"
import { useState } from "react"
import {
  addSpecialization,
  getSpecializations,
  deleteSpecialization,
} from "../services/specializationsApi"

import {
  addYeshiva,
  getYeshivas,
  deleteYeshiva,
} from "../services/yeshivasApi"
import { changeMemberRole, getMembers } from "@/services/membersApi"
import type { Member } from "@/types/Member"
import { toast } from "sonner"
import MemberRow from "@/components/MemberRow"
import { deleteGroup } from "@/services/groupsApi"
import { useNavigate } from "react-router-dom"

function GroupSetting() {
  const { token, selectedGroup ,clearSelectedGroup} = useAuth()
  const queryClient=useQueryClient()
  const[className,setClassName]=useState("")
  const navigate = useNavigate()
  
  const {
    data: classes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes", selectedGroup?.id],
    queryFn: () => {
      if (!token || !selectedGroup) {
        throw new Error("Missing token or selected group")
      }

      return getClasses(selectedGroup.id, token)
    },
    enabled: !!token && !!selectedGroup,
  })

  const handleaddClass = async () => {
    if (!token || !className||!selectedGroup) return
  
    await addClass(selectedGroup.id,token ,className)
  
    queryClient.invalidateQueries({
      queryKey: ["classes"]
    })
  
    setClassName("")
  }
  
const handleDeleteClass = async (id: number) => {
  if (!token || !selectedGroup) return
  try{
    await deleteClass(
      selectedGroup.id,
      token,
      id)
  
await queryClient.invalidateQueries({
  queryKey:["classes",selectedGroup.id],
})
toast.success("הכיתה נמחקה")
}catch(error){
  if(error instanceof Error&&
    error.message==="CLASS_IN_USE"){
      toast.error(
        "לא ניתן למחוק את הכיתה כי קיימת כלה המשויכת אליה"
      )
      return
    }
     toast.error(
        "לא הצלחנו למחוק את הכיתה"
      )
}
 }






const handleDeleteGroup = async () => {
  if (!token || !selectedGroup) return

  try {
    await deleteGroup(
      selectedGroup.id,
      token
    )

    await queryClient.invalidateQueries({
      queryKey: ["groups"],
    })

    clearSelectedGroup()

    toast.success("הקבוצה נמחקה")
    navigate("/groups")
  } catch (error) {
    toast.error("לא הצלחנו למחוק את הקבוצה")
  }
}













  const[specializationName,setSpecializationName]=useState("")
  const {
    data: specializations = [],
    isLoading: isLoadingSpecializations,
    error: specializationsError
  } = useQuery({
    queryKey: ["specializations", selectedGroup?.id],
    queryFn: () => {
      if (!token || !selectedGroup) {
        throw new Error("Missing token or selected group")
      }

      return getSpecializations(selectedGroup.id, token)
    },
    enabled: !!token && !!selectedGroup,
  })

  const handleaddSpecialization = async () => {
    if (!token || !specializationName||!selectedGroup) return
  
    await addSpecialization(selectedGroup.id,token ,specializationName)
  
    queryClient.invalidateQueries({
      queryKey: ["specializations"]
    })
  
    setSpecializationName("")
  }


const handleDeleteSpecialization = async (id: number) => {
  if (!token || !selectedGroup) return

  try {
    await deleteSpecialization(
      selectedGroup.id,
      token,
      id
    )

    await queryClient.invalidateQueries({
      queryKey: ["specializations", selectedGroup.id],
    })

    toast.success("ההתמחות נמחקה")
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SPECIALIZATION_IN_USE"
    ) {
      toast.error(
        "לא ניתן למחוק את ההתמחות כי קיימת כלה המשויכת אליה"
      )
      return
    }

    toast.error("לא הצלחנו למחוק את ההתמחות")
  }
}



  const[yeshivaName,setYeshivaName]=useState("")
  const {
    data: yeshivas = [],
    isLoading: isLoadingYeshivas,
    error: yeshivasError
  } = useQuery({
    queryKey: ["yeshivas", selectedGroup?.id],
    queryFn: () => {
      if (!token || !selectedGroup) {
        throw new Error("Missing token or selected group")
      }

      return getYeshivas(selectedGroup.id, token)
    },
    enabled: !!token && !!selectedGroup,
  })

  const handleaddYeshivas = async () => {
    if (!token || !yeshivaName||!selectedGroup) return
  
    await addYeshiva(selectedGroup.id,token ,yeshivaName)
  
    queryClient.invalidateQueries({
      queryKey: ["yeshivas"]
    })
  
    setYeshivaName("")
  }

 const {
    data: members = [],
    // isLoading: isLoadingMembers,
    // error: membersError
  } = useQuery({
    queryKey: ["members", selectedGroup?.id],
    queryFn: () => {
      if (!token || !selectedGroup) {
        throw new Error("Missing token or selected group")
      }

      return getMembers(selectedGroup.id, token)
    },
    enabled: !!token && !!selectedGroup,
  })


const handleDeleteYeshiva = async (id: number) => {
  if (!token || !selectedGroup) return

  try {
    await deleteYeshiva(
      selectedGroup.id,
      token,
      id
    )

    await queryClient.invalidateQueries({
      queryKey: ["yeshivas", selectedGroup.id],
    })

    toast.success("הישיבה נמחקה")
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "YESHIVA_IN_USE"
    ) {
      toast.error(
        "לא ניתן למחוק את הישיבה כי קיימת כלה המשויכת אליה"
      )
      return
    }

    toast.error("לא הצלחנו למחוק את הישיבה")
  }
}







 const [, setSelectedMember] =
    useState<Member | null>(null)
 const updateMemberMutation = useMutation({
    mutationFn: (updatedMember: Member) => {
      if (!token || !selectedGroup) {
        throw new Error("Missing token or selected group")
      }

      return changeMemberRole(
        selectedGroup.id,
      updatedMember.userId,
      updatedMember.role as "Member" | "Contributor",
      token
      )
    },

    onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ["members", selectedGroup?.id],
    })

    setSelectedMember(null)
    toast.success("ההרשאה עודכנה בהצלחה!")
  },

  onError: () => {
    toast.error("לא הצלחנו לעדכן את ההרשאה")
  },
})

const[searchText,setSearchText]=useState("")
const[showContributors,setshowContributors]=useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  if (isLoading) {
    return <div>טוען...</div>
  }

  if (error) {
    return <div>שגיאה בטעינת כיתות</div>
  }


  if (isLoadingSpecializations) {
    return <div>טוען...</div>
  }

  if (specializationsError) {
    return <div > התמחויות שגיאה בטעינת </div>
  }

  
  if (isLoadingYeshivas) {
    return <div>טוען...</div>
  }

  if (yeshivasError) {
    return <div > ישיבות שגיאה בטעינת </div>
  }



return (
  <div dir="rtl" className="space-y-8">

    <section>
      <h1 className="text-3xl font-bold text-brand-teal">
        הגדרות קבוצה
      </h1>

      <p className="mt-2 text-muted-foreground">
        ניהול כיתות, התמחויות וישיבות של הקבוצה
      </p>
    </section>


<section className="rounded-2xl border border-brand-teal/10 bg-white p-5 shadow-sm">
  <div className="mb-5">
    <h2 className="text-xl font-bold text-brand-teal">
      ניהול הרשאות
    </h2>
    <p className="mt-1 text-sm text-muted-foreground">
      בחרי אילו חברות יוכלו להוסיף ולעדכן פרטים בקבוצה
    </p>
  </div>
  <button
  type="button"
  onClick={() => setshowContributors(!showContributors)}
  className="
    mb-4
    rounded-xl
    border border-brand-teal/20
    bg-brand-teal/5
    px-4 py-2
    text-sm font-semibold
    text-brand-teal
    transition
    hover:bg-brand-teal/10
  "
>
  {showContributors
    ? "הסתרת בעלות הרשאת עריכה"
    : "בעלות הרשאת עריכה"}
</button>
{showContributors && (
  <div className="mb-5 rounded-xl bg-brand-pink/10 px-4">
    {members
      .filter((member) => member.role === "Contributor")
      .map((member) => (
        <MemberRow
          key={member.userId}
          member={member}
          isUpdating={updateMemberMutation.isPending}
          onChangeRole={(member) =>
            updateMemberMutation.mutate({
              ...member,
              role: "Member",
            })
          }
        />
      ))}

    {members.filter(
      (member) => member.role === "Contributor"
    ).length === 0 && (
      <p className="py-5 text-center text-sm text-muted-foreground">
        אין כרגע חברות בעלות הרשאת עריכה
      </p>
    )}
  </div>
)}
<input
  type="search"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  placeholder="חפשי חברה לפי שם או מייל..."
  className="
    mb-4 w-full rounded-xl
    border border-brand-teal/20
    bg-brand-teal/5
    px-4 py-3
    text-sm
    outline-none
    transition
    focus:border-brand-teal
    focus:ring-2 focus:ring-brand-teal/10
  "
/>

{searchText.trim() ? (
  <div className="divide-y divide-brand-teal/10">
    {members
      .filter((member) => {
        const search = searchText.trim().toLowerCase()

        return (
          member.fullName.toLowerCase().includes(search) ||
          member.email.toLowerCase().includes(search)
        )
      })
      .map((member) => (
        <MemberRow
          key={member.userId}
          member={member}
          isUpdating={updateMemberMutation.isPending}
          onChangeRole={(member) =>
            updateMemberMutation.mutate({
              ...member,
              role:
                member.role === "Contributor"
                  ? "Member"
                  : "Contributor",
            })
          }
        />
      ))}
  </div>
) : (
  <p className="py-5 text-center text-sm text-muted-foreground">
    חפשי חברה כדי לנהל את ההרשאות שלה
  </p>
)}

</section>





    <section
  className="
    rounded-2xl
    border border-brand-teal/10
    bg-white
    p-5
    shadow-sm
  "
>
  <h2 className="mb-4 text-xl font-bold text-brand-teal">
    כיתות
  </h2>

  <div className="mb-5 flex gap-2">
    <input
      placeholder="כיתה"
      onChange={(e) => setClassName(e.target.value)}
      value={className}
      className="
        h-11 flex-1
        rounded-xl
        border border-brand-teal/20
        px-4
        outline-none
        transition
        focus:border-brand-teal/50
        focus:ring-2
        focus:ring-brand-teal/10
      "
    />

    <button
      onClick={() => handleaddClass()}
      className="
        rounded-xl
        bg-brand-teal
        px-5
        font-semibold
        text-white
        transition
        hover:bg-brand-teal/90
      "
    >
      הוספת כיתה
    </button>
  </div>

  <div className="flex flex-wrap gap-2">
    {classes.map((groupClass) => (
      <div
  key={groupClass.id}
  className="
    flex items-center gap-2
    rounded-full
    border border-brand-pink/50
    bg-brand-pink/25
    py-1.5 pr-4 pl-1.5
    text-sm font-semibold
    text-brand-teal
    transition
    hover:bg-brand-pink/40
  "
>
  <span>{groupClass.name}</span>

  <button
    type="button"
    onClick={() => handleDeleteClass(groupClass.id)}
    title="מחיקת כיתה"
    className="
      flex h-7 w-7
      cursor-pointer
      items-center justify-center
      rounded-full
      text-lg font-bold
      leading-none
      text-brand-coral
      transition
      hover:bg-brand-coral/15
      hover:scale-110
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-brand-coral/30
    "
  >
    ×
  </button>
</div>
    ))}
  </div>
</section>
   <section
  className="
    rounded-2xl
    border border-brand-teal/10
    bg-white
    p-5
    shadow-sm
  "
>
  <h2 className="mb-4 text-xl font-bold text-brand-teal">
    התמחויות
  </h2>

  <div className="mb-5 flex gap-2">
    <input
      placeholder="התמחות"
      onChange={(e) => setSpecializationName(e.target.value)}
      value={specializationName}
      className="
        h-11 flex-1
        rounded-xl
        border border-brand-teal/20
        px-4
        outline-none
        transition
        focus:border-brand-teal/50
        focus:ring-2
        focus:ring-brand-teal/10
      "
    />

    <button
      onClick={() => handleaddSpecialization()}
      className="
        rounded-xl
        bg-brand-teal
        px-5
        font-semibold
        text-white
        transition
        hover:bg-brand-teal/90
      "
    >
      הוספת התמחות
    </button>
  </div>

  <div className="flex flex-wrap gap-2">
    {specializations.map((groupSpec) => (
      <div
  key={groupSpec.id}
  className="
    flex items-center gap-2
    rounded-full
    bg-brand-pink/35
    px-4 py-2
    text-sm font-semibold
    text-brand-teal
  "
>
  <span>{groupSpec.name}</span>

  <button
    type="button"
    onClick={() => handleDeleteSpecialization(groupSpec.id)}
    className="
  flex h-7 w-7
  items-center justify-center
  rounded-full
  text-lg font-bold
  text-brand-coral
  transition
  cursor-pointer
  hover:bg-brand-coral/15
  hover:scale-110
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-brand-coral/30
"
  >
    ×
  </button>
</div>
    ))}
  </div>
</section>


<section
  className="
    rounded-2xl
    border border-brand-teal/10
    bg-white
    p-5
    shadow-sm
  "
>
  <h2 className="mb-4 text-xl font-bold text-brand-teal">
    ישיבות
  </h2>

  <div className="mb-5 flex gap-2">
    <input
      placeholder="ישיבה"
      onChange={(e) => setYeshivaName(e.target.value)}
      value={yeshivaName}
      className="
        h-11 flex-1
        rounded-xl
        border border-brand-teal/20
        px-4
        outline-none
        transition
        focus:border-brand-teal/50
        focus:ring-2
        focus:ring-brand-teal/10
      "
    />

    <button
      onClick={() => handleaddYeshivas()}
      className="
        rounded-xl
        bg-brand-teal
        px-5
        font-semibold
        text-white
        transition
        hover:bg-brand-teal/90
      "
    >
      הוספת ישיבה
    </button>
  </div>

  <div className="flex flex-wrap gap-2">
    {yeshivas.map((yes) => (
      <div
  key={yes.id}
  className="
    flex items-center gap-2
    rounded-full
    border border-brand-pink/50
    bg-brand-pink/25
    py-1.5 pr-4 pl-1.5
    text-sm font-semibold
    text-brand-teal
    transition
    hover:bg-brand-pink/40
  "
>
  <span>{yes.name}</span>

  <button
    type="button"
    onClick={() => handleDeleteYeshiva(yes.id)}
    title="מחיקת ישיבה"
    className="
      flex h-7 w-7
      cursor-pointer
      items-center justify-center
      rounded-full
      text-lg font-bold
      leading-none
      text-brand-coral
      transition
      hover:bg-brand-coral/15
      hover:scale-110
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-brand-coral/30
    "
  >
    ×
  </button>
</div>
    ))}
  </div>
</section>
<section className="rounded-2xl border border-brand-coral/20 bg-white p-5 shadow-sm">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-lg font-bold text-brand-coral">
        מחיקת קבוצה
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        מחיקת הקבוצה תמחק את כל הנתונים השייכים אליה
      </p>
    </div>

    <button
      type="button"
      onClick={() => setShowDeleteConfirm(true)}
      className="
        rounded-xl
        border border-brand-coral/30
        bg-brand-coral/10
        px-5 py-2.5
        text-sm font-semibold
        text-brand-coral
        transition
        hover:bg-brand-coral/20
      "
    >
      מחיקת הקבוצה
    </button>
  </div>
</section>
{showDeleteConfirm && (
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
      <h2 className="text-xl font-bold text-brand-coral">
        למחוק את הקבוצה?
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        כל הנתונים של הקבוצה יימחקו, כולל כלות, ברכות,
        כיתות, התמחויות וישיבות.
      </p>

      <p className="mt-2 text-sm font-semibold text-brand-coral">
        לא ניתן לבטל פעולה זו.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(false)}
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
          onClick={handleDeleteGroup}
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
          כן, למחוק
        </button>
      </div>
    </div>
  </div>
)}
     </div>
)
}

export default GroupSetting