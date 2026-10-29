import type { Bride } from "../types/Bride"

import { API_URL } from "../config/api"
export async function getBrides(
  groupId: string,
  token: string
): Promise<Bride[]> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/brides`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to load brides")
  }

  return response.json()
}

export async function createBride(
  groupId: string,
  token: string,
  bride: Omit<Bride, "id">
): Promise<Bride> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/brides`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bride)
    }
  )

  if (!response.ok) {
    throw new Error("Failed to add bride")
  }

  return response.json()
}

export async function updateBrideApi(
  groupId: string,
  token: string,
      updatedBride: Bride
): Promise<Bride> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/brides/${updatedBride.id}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedBride)
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update bride")
  }

  return response.json()
}

export async function deleteBrideApi(
  groupId: string,
  token: string,
  brideId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/brides/${brideId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    
    }
  )

  if (!response.ok) {
    throw new Error("Failed to delete bride")
  }
}

export async function linkBrideUser(
  groupId: string,
  token: string,
  brideId: number,
  userId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/brides/${brideId}/link-user`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to link bride to user")
  }
}

export async function unlinkBrideUser(
  groupId: string,
  token: string,
  brideId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/brides/${brideId}/link-user`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to unlink bride from user")
  }
}
