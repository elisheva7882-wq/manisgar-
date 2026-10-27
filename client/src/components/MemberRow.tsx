import type { Member } from "@/types/Member"

interface MemberRowProps {
  member: Member
  onChangeRole: (member: Member) => void
  isUpdating: boolean
}

function MemberRow({
  member,
  onChangeRole,
  isUpdating,
}: MemberRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink/50 font-bold text-brand-teal">
          {member.fullName?.charAt(0)}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-foreground">
            {member.fullName}
          </p>

          <p className="break-all text-sm text-muted-foreground">
            {member.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            member.role === "Admin"
              ? "bg-brand-gold/20 text-amber-800"
              : member.role === "Contributor"
              ? "bg-brand-teal/10 text-brand-teal"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {member.role === "Admin"
            ? "מנהלת"
            : member.role === "Contributor"
            ? "הרשאת עריכה"
            : "חברה"}
        </span>

        {member.role !== "Admin" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onChangeRole(member)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
              member.role === "Contributor"
                ? "border-brand-coral/40 text-brand-coral hover:bg-brand-coral/10"
                : "border-brand-teal/20 bg-brand-teal/5 text-brand-teal hover:bg-brand-teal/10"
            }`}
          >
            {member.role === "Contributor"
              ? "ביטול הרשאה"
              : "הענקת הרשאה"}
          </button>
        )}
      </div>
    </div>
  )
}

export default MemberRow