import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../context/AuthContext"
import { getBrides } from "../services/bridesApi"


function StatisticsPage(){
  const{selectedGroup,token}=useAuth()
    const { data: brides = [] } = useQuery({
      queryKey: ["brides", selectedGroup?.id],
      queryFn: () => {
        if (!token || !selectedGroup) {
          throw new Error("Missing token or selected group")
        }
  
        return getBrides(selectedGroup.id, token)
      },
      enabled: !!token && !!selectedGroup,
    })
  
const countClasses=brides.reduce<Record<string, number>>((acc,bride)=>{
  acc[bride.className] = (acc[bride.className] || 0) + 1;
  return acc;
},{}
)
const classData = Object.entries(countClasses).map(
  ([name, count]) => ({
    name,
    count,
    percentage: ((count / brides.length) * 100).toFixed(1)
  })
)

const countSpecializations=brides.reduce<Record<string, number>>((acc,bride)=>{
  acc[bride.specialization] = (acc[bride.specialization] || 0) + 1;
  return acc;
},{}
)
const specializationData = Object.entries(countSpecializations).map(
  ([name, count]) => ({
    name,
    count,
    percentage: ((count / brides.length) * 100).toFixed(1)
  })
)

const countYeshivas=brides.reduce<Record<string, number>>((acc,bride)=>{
  acc[bride.yeshiva] = (acc[bride.yeshiva] || 0) + 1;
  return acc;
},{}
)
const yeshivaData = Object.entries(countYeshivas).map(
  ([name, count]) => ({
    name,
    count,
    percentage: ((count / brides.length) * 100).toFixed(1)
  })
)






 return (
  <div dir="rtl" className="space-y-8">

    <section>
      <h1 className="text-3xl font-bold text-brand-teal">
        סטטיסטיקות
      </h1>

      <p className="mt-2 text-muted-foreground">
        תמונת מצב של הקבוצה לפי כיתות, התמחויות וישיבות
      </p>
    </section>
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
<div className="rounded-2xl border border-brand-teal/10 bg-white p-5 shadow-sm">
  <p className="text-sm text-muted-foreground">
    סה״כ כלות
  </p>

  <p className="mt-1 text-3xl font-bold text-brand-teal">
    {brides.length}
  </p>
</div>
  <div className="rounded-2xl border border-brand-teal/10 bg-white p-5 shadow-sm">
    <p className="text-sm text-muted-foreground">
      כיתות
    </p>

    <p className="mt-1 text-3xl font-bold text-brand-teal">
      {classData.length}
    </p>
  </div>

  <div className="rounded-2xl border border-brand-teal/10 bg-white p-5 shadow-sm">
    <p className="text-sm text-muted-foreground">
      התמחויות
    </p>

    <p className="mt-1 text-3xl font-bold text-brand-teal">
      {specializationData.length}
    </p>
  </div>

  <div className="rounded-2xl border border-brand-teal/10 bg-white p-5 shadow-sm">
    <p className="text-sm text-muted-foreground">
      ישיבות
    </p>

    <p className="mt-1 text-3xl font-bold text-brand-teal">
      {yeshivaData.length}
    </p>
  </div>

</div>
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-brand-teal">
        לפי כיתה
      </h2>
<div className="rounded-2xl border border-brand-teal/10 bg-white p-5 shadow-sm">
  <div className="space-y-5">
    {classData.map((item) => (
      <div key={item.name}>
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="font-semibold text-brand-teal">
            {item.name}
          </span>

          <span className="shrink-0 text-sm text-muted-foreground">
            {item.count} כלות · {item.percentage}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-brand-teal/10">
          <div
            className="h-full rounded-full bg-brand-teal transition-all"
            style={{
              width: `${item.percentage}%`,
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
</section>

<section className="space-y-4">
<h2 className="text-xl font-bold text-brand-teal">
  לפי התמחות
</h2>

<div className="rounded-2xl border border-brand-teal/10 bg-white p-5 shadow-sm">
  <div className="space-y-5">
    {specializationData.map((item) => (
      <div key={item.name}>
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="font-semibold text-brand-teal">
            {item.name}
          </span>

          <span className="shrink-0 text-sm text-muted-foreground">
            {item.count} כלות · {item.percentage}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-brand-teal/10">
          <div
            className="h-full rounded-full bg-brand-teal transition-all"
            style={{
              width: `${item.percentage}%`,
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>

</section>

<section className="space-y-4">
  <h2 className="text-xl font-bold text-brand-teal">
    לפי ישיבה
  </h2>

<div className="rounded-2xl border border-brand-teal/10 bg-white p-5 shadow-sm">
  <div className="space-y-5">
    {yeshivaData.map((item) => (
      <div key={item.name}>
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="font-semibold text-brand-teal">
            {item.name}
          </span>

          <span className="shrink-0 text-sm text-muted-foreground">
            {item.count} כלות · {item.percentage}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-brand-teal/10">
          <div
            className="h-full rounded-full bg-brand-teal transition-all"
            style={{
              width: `${item.percentage}%`,
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
    </section>

  </div>
)
}

export default StatisticsPage