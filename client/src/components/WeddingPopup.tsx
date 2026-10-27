import type { Bride } from "../types/Bride"
import { useEffect } from "react"
import confetti from "canvas-confetti"
import {
  Clock3,
  MapPin,
  PartyPopper,
  X,
} from "lucide-react"
interface IWeddingPopupProps{
    weddingsToday:Bride[],
    onClose:()=>void
}

export const WeddingPopup=({ weddingsToday, onClose }: IWeddingPopupProps)=>{
    useEffect(() => {
  const colors = [
    "#167F83",
    "#F17876",
    "#F6B84B",
    "#F7D9D7",
  ]

  const boom = (x: number, y: number) => {
    confetti({
      particleCount: 70,
      spread: 85,
      startVelocity: 45,
      gravity: 0.9,
      scalar: 0.9,
      ticks: 180,
      origin: { x, y },
      colors,
    })
  }

  // בום ראשון למעלה
  boom(0.5, 0.18)

  // בום מצד ימין
  const rightBoom = setTimeout(() => {
    boom(0.78, 0.35)
  }, 350)

  // בום מצד שמאל
  const leftBoom = setTimeout(() => {
    boom(0.22, 0.38)
  }, 700)

  return () => {
    clearTimeout(rightBoom)
    clearTimeout(leftBoom)
  }
}, [])
    return(
    <>
<div
  dir="rtl"
  className="
    fixed inset-0 z-[100]
    flex items-center justify-center
    bg-black/50
    px-4 py-6
    backdrop-blur-sm
  "
>
    <div
  className="
    wedding-popup-card
    relative
    max-h-[90vh]
    w-full max-w-md
    overflow-y-auto
    rounded-3xl
    border border-brand-coral/20
    bg-white
    p-6
    shadow-2xl
  "
>
  {/* כפתור סגירה */}
<button
  onClick={onClose}
  className="
    absolute left-4 top-4
    flex size-9 items-center justify-center
    rounded-full
    bg-brand-pink/30
    text-brand-teal
    transition
    hover:bg-brand-pink/60
  "
>
  <X className="size-4" />
</button>


{/* כותרת */}
<div className="mb-6 text-center">

  <div
    className="
      mx-auto mb-3
      flex size-14 items-center justify-center
      rounded-full
      bg-brand-coral/15
      text-brand-coral
    "
  >
    <PartyPopper className="size-7" />
  </div>

  <p className="text-sm font-semibold text-brand-coral">
    זה קורה היום!
  </p>

  <h2 className="mt-1 text-3xl font-bold text-brand-teal">
    היום חוגגים 🎉
  </h2>

  <p className="mt-2 text-sm text-muted-foreground">
    הגיע היום הגדול
  </p>
</div>


{/* החתונות של היום */}
<div className="space-y-4">

  {weddingsToday.map((bride) => (
    <div
      key={bride.id}
      className="
        rounded-2xl
        border border-brand-teal/10
        bg-brand-pink/15
        p-5
      "
    >

      {/* שמות */}
      <div className="mb-4 text-center">
        <p className="text-xl font-bold text-brand-teal">
          {bride.brideFirstName} {bride.brideLastName}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          ו־{bride.groomLastName}
        </p>
      </div>


      {/* שעה */}
      {bride.weddingTime && (
        <div className="flex items-center gap-3 py-2">
          <div
            className="
              flex size-9 shrink-0
              items-center justify-center
              rounded-full
              bg-white
              text-brand-teal
              shadow-sm
            "
          >
            <Clock3 className="size-4" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              שעה
            </p>

            <p className="font-semibold">
              {bride.weddingTime}
            </p>
          </div>
        </div>
      )}


      {/* אולם */}
      {bride.weddingHall && (
        <div className="flex items-center gap-3 py-2">
          <div
            className="
              flex size-9 shrink-0
              items-center justify-center
              rounded-full
              bg-white
              text-brand-teal
              shadow-sm
            "
          >
            💍
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              אולם
            </p>

            <p className="font-semibold">
              {bride.weddingHall}
            </p>
          </div>
        </div>
      )}


      {/* עיר */}
      {bride.weddingCity && (
        <div className="flex items-center gap-3 py-2">
          <div
            className="
              flex size-9 shrink-0
              items-center justify-center
              rounded-full
              bg-white
              text-brand-teal
              shadow-sm
            "
          >
            <MapPin className="size-4" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              עיר
            </p>

            <p className="font-semibold">
              {bride.weddingCity}
            </p>
          </div>
        </div>
      )}

    </div>
  ))}

</div>


{/* כפתור תחתון */}
<button
  onClick={onClose}
  className="
    mt-6 h-11 w-full
    rounded-xl
    bg-brand-coral
    font-semibold text-white
    shadow-sm
    transition
    hover:bg-brand-coral/90
    hover:shadow-md
  "
>
  מזל טוב! 🎉
</button>
</div>
     </div>
    </>
    )

}