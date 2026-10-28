import type { Blessing } from "../types/Blessing"



import { API_URL } from "../config/api"
export async function sendBlessing(
  groupId: string,
  token: string,
  brideId: number,
  content:string
) {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/brides/${brideId}/blessings`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({content})
    }
  )

  if (!response.ok) {
    throw new Error("Failed to send blessing")
  }

  return response.json()
}

export async function getMyBlessings(
  groupId: string,
  token: string,
) :Promise<Blessing[]> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/blessings/mine`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to load blessings")
  }

  return response.json()
}