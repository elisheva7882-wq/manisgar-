import type { Bride } from "../types/Bride"

interface BrideItemProps {
  bride: Bride
  onSelect: (bride: Bride) => void
}

export const BrideItem = ({
  bride,
  onSelect,
}: BrideItemProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(bride)}
      className="
        w-full rounded-xl
        border border-brand-pink
        bg-white
        px-4 py-3
        text-right
        transition-all duration-200
        hover:-translate-y-0.5
        hover:bg-brand-pink/30
        hover:border-brand-coral/50
        hover:shadow-sm
      "
    >
      <div className="flex items-center gap-3">

        <span className="size-2.5 shrink-0 rounded-full bg-brand-coral" />

        <span className="font-semibold text-foreground">
          {bride.brideFirstName} {bride.brideLastName} - {bride.groomLastName}
        </span>

      </div>
    </button>
  )
}