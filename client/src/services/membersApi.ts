import type { Member } from "../types/Member"

const API_URL = "http://localhost:5095/api"

export async function getMembers(
  groupId: string,
  token: string
): Promise<Member[]> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/members`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to load members")
  }

  return response.json()
}
export async function changeMemberRole(
  groupId: string,
  userId: string,
  role: "Member" | "Contributor",
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/members/${userId}/role`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to change member role")
  }
}