
export type Member = {
  userId: string
  fullName: string
  email:string
role: "Member" | "Contributor" | "Admin"
  joinedAtUtc:string
  
}