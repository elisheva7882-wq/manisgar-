
import type { Bride } from "../types/Bride";
import { BrideItem } from "./BrideItem";




interface RenderItemProps {
  brides: Bride[]
  onSelect: (bride: Bride) => void
  str:string
}



export const RenderClasses = ({ onSelect, str ,brides}: RenderItemProps) => {
 const classes= [...new Set( brides.map((bride) => bride.className))]
  return classes.map((cls) => {
    const filteredBrides = brides
      .filter((bride) => bride.className === cls)
      .filter((bride) =>  bride.brideFirstName.includes(str)||bride.brideLastName.includes(str)||bride.groomLastName.includes(str))

    if (filteredBrides.length === 0) {
      return null
    }

return (
  <section
    key={cls}
    className="mb-8 rounded-2xl bg-white p-5 shadow-sm"
  >
    <div className="mb-5 flex items-center gap-3">
      <h2 className="text-xl font-bold text-brand-teal">
        {cls}
      </h2>

      <span className="rounded-full bg-brand-pink px-3 py-1 text-xs font-semibold text-brand-teal">
        {filteredBrides.length}
      </span>
    </div>

    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {filteredBrides.map((bride) => (
        <BrideItem
          key={bride.id}
          bride={bride}
          onSelect={onSelect}
        />
      ))}
    </div>
  </section>
)
  })
}
    
  



