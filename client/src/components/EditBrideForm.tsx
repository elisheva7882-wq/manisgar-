import { useForm, type SubmitHandler } from "react-hook-form";
import type { Bride } from "../types/Bride";
import { useQuery } from "@tanstack/react-query"
import { getClasses } from "../services/classesApi"
import { getSpecializations } from "../services/specializationsApi";
import { getYeshivas } from "../services/yeshivasApi";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Controller } from "react-hook-form"
import { HebrewDatePicker } from "@/components/HebrewDatePicker"
import { getMembers } from "../services/membersApi"
import { createBride } from "@/services/bridesApi";
interface IFormInput {
  brideFirstName: string
  brideLastName: string
  groomFirstName: string
  groomLastName: string

  className: string
  specialization: string
  status: "מאורסת" | "נשואה"
  yeshiva: string

  weddingDate: string
  weddingTime: string
  weddingHall: string
  weddingCity: string

  linkedUserId?: string | null
}
interface EditBrideFormProps {
  bride: Bride
  onUpdateBride: (bride: Bride) => void
}




function EditBrideForm({
  bride,
  onUpdateBride,
}: EditBrideFormProps) {

const{selectedGroup,token}=useAuth()

const { data: classes } = useQuery({
  queryKey: ["classes", selectedGroup?.id],
  queryFn: () =>{ if (!token || !selectedGroup) {
      throw new Error("Missing token or selected group")
    }
return getClasses(selectedGroup?.id, token)
} ,
  enabled: !!token && !!selectedGroup,
})

const { data: specializations } = useQuery({
  queryKey: ["specializations", selectedGroup?.id],
  queryFn: () =>{ if (!token || !selectedGroup) {
      throw new Error("Missing token or selected group")
    }
return getSpecializations(selectedGroup?.id, token)
} ,
  enabled: !!token && !!selectedGroup,
})

const { data: yeshivas } = useQuery({
  queryKey: ["yeshivas", selectedGroup?.id],
  queryFn: () =>{ if (!token || !selectedGroup) {
      throw new Error("Missing token or selected group")
    }
return getYeshivas(selectedGroup?.id, token)
} ,
  enabled: !!token && !!selectedGroup,
})

const {
  register,
  handleSubmit,
  control,
  formState: { errors },
} = useForm<IFormInput>({
  defaultValues: {
    brideFirstName: bride.brideFirstName,
    brideLastName: bride.brideLastName,

    groomFirstName: bride.groomFirstName ?? "",
    groomLastName: bride.groomLastName ?? "",

    className: bride.className,
    specialization: bride.specialization,
    status: bride.status,
    yeshiva: bride.yeshiva,

    weddingDate: bride.weddingDate ?? "",
    weddingTime: bride.weddingTime ?? "",
    weddingHall: bride.weddingHall ?? "",
    weddingCity: bride.weddingCity ?? "",

    linkedUserId: bride.linkedUserId ?? "",
  },
})

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







const onSubmit: SubmitHandler<IFormInput> = (data) => {
  onUpdateBride({
    ...bride,
    ...data,
  })
}

  return (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-6"
  >
    {/* פרטי הכלה */}
    <section className="space-y-4">
      <div>
        <h3 className="font-bold text-brand-teal">
          פרטי הכלה
        </h3>
        <p className="text-sm text-muted-foreground">
          הפרטים הבסיסיים של הכלה
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            שם פרטי *
          </label>

          <Input
            {...register("brideFirstName", { required: true })}
            placeholder="שם פרטי"
          />

          {errors.brideFirstName && (
            <p className="text-xs text-destructive">
              שם פרטי הוא שדה חובה
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            שם משפחה *
          </label>

          <Input
            {...register("brideLastName", { required: true })}
            placeholder="שם משפחה"
          />

          {errors.brideLastName && (
            <p className="text-xs text-destructive">
              שם משפחה הוא שדה חובה
            </p>
          )}
        </div>
      </div>
    </section>

    {/* פרטי החתן */}
    <section className="space-y-4 border-t pt-5">
      <div>
        <h3 className="font-bold text-brand-teal">
          פרטי החתן
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            שם פרטי
          </label>

          <Input
            {...register("groomFirstName")}
            placeholder="שם פרטי"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            שם משפחה *
          </label>

          <Input
            {...register("groomLastName", { required: true })}
            placeholder="שם משפחה"
          />

          {errors.groomLastName && (
            <p className="text-xs text-destructive">
              שם משפחה הוא שדה חובה
            </p>
          )}
        </div>
      </div>
    </section>

    {/* לימודים */}
    <section className="space-y-4 border-t pt-5">
      <div>
        <h3 className="font-bold text-brand-teal">
          פרטים נוספים
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        {/* כיתה */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            כיתה *
          </label>

          <select
            {...register("className", { required: true })}
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
          >
            <option value="">
              בחרי כיתה
            </option>

            {classes?.map((cls) => (
              <option
                key={cls.id}
                value={cls.name}
              >
                {cls.name}
              </option>
            ))}
          </select>

          {errors.className && (
            <p className="text-xs text-destructive">
              כיתה היא שדה חובה
            </p>
          )}
        </div>

        {/* התמחות */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            התמחות *
          </label>

          <select
            {...register("specialization", { required: true })}
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
          >
            <option value="">
              בחרי התמחות
            </option>

            {specializations?.map((spec) => (
              <option
                key={spec.id}
                value={spec.name}
              >
                {spec.name}
              </option>
            ))}
          </select>
        </div>

        {/* ישיבה */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            ישיבה *
          </label>

          <select
            {...register("yeshiva", { required: true })}
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
          >
            <option value="">
              בחרי ישיבה
            </option>

            {yeshivas?.map((yes) => (
              <option
                key={yes.id}
                value={yes.name}
              >
                {yes.name}
              </option>
            ))}
          </select>

          {errors.yeshiva && (
            <p className="text-xs text-destructive">
              ישיבה היא שדה חובה
            </p>
          )}
        </div>

        {/* סטטוס */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            סטטוס *
          </label>

          <select
            {...register("status", { required: true })}
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
          >
            <option value="">
              בחרי סטטוס
            </option>
            <option value="מאורסת">
              מאורסת
            </option>
            <option value="נשואה">
              נשואה
            </option>
          </select>

          {errors.status && (
            <p className="text-xs text-destructive">
              סטטוס הוא שדה חובה
            </p>
          )}
        </div>
      </div>
    </section>

    {/* תאריך */}
    <section className="space-y-2 border-t pt-5">
      <label className="text-sm font-semibold">
        תאריך חתונה
      </label>

      <Controller
  name="weddingDate"
  control={control}
  render={({ field }) => (
    <HebrewDatePicker
      value={field.value ?? ""}
      onChange={field.onChange}
    />



  )}
/>
<div className="grid gap-4 sm:grid-cols-2">
  <div className="space-y-2">
    <label className="text-sm font-semibold">
      שעת החתונה
    </label>

    <Input
      type="time"
      {...register("weddingTime")}
    />
  </div>

  <div className="space-y-2">
    <label className="text-sm font-semibold">
      אולם
    </label>

    <Input
      {...register("weddingHall")}
      placeholder="שם האולם"
    />
  </div>

  <div className="space-y-2">
    <label className="text-sm font-semibold">
      עיר
    </label>

    <Input
      {...register("weddingCity")}
      placeholder="עיר החתונה"
    />
  </div>
</div>

      
    </section>
    
  <div className="space-y-2">
    <label className="text-sm font-semibold">
      קישור לחשבון
    </label>

    <select
      {...register("linkedUserId")}
      className="
        h-11 w-full
        rounded-xl
        border border-brand-teal/20
        bg-white
        px-4
        outline-none
        focus:border-brand-teal/50
        focus:ring-2 focus:ring-brand-teal/10
      "
    >
      <option value="">ללא חשבון מקושר</option>

      {members.map((member) => (
        <option
          key={member.userId}
          value={member.userId}
        >
          {member.fullName} — {member.email}
        </option>
      ))}
    </select>
  </div>


    {/* שמירה */}
    <div className="flex justify-end border-t pt-5">
      <Button
        type="submit"
        className="min-w-32 bg-brand-coral text-white hover:bg-brand-coral/90"
      >
        שמירה
      </Button>
    </div>
  </form>
)
}



export default EditBrideForm