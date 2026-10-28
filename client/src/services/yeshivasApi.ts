import type { Yeshiva } from "../types/Yeshiva"

import { API_URL } from "../config/api"
export async function getYeshivas(
  groupId: string,
  token: string
): Promise<Yeshiva[]> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/yeshivas`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to load yeshivas")
  }

  return response.json()
}

export async function addYeshiva(
  groupId: string,
  token: string,
  name: string
): Promise<Yeshiva> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/yeshivas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to add yeshiva")
  }

  return response.json()
}


export async function deleteYeshiva(
  groupId: string,
  token: string,
  yeshivaId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/yeshivas/${yeshivaId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (response.status === 409) {
    throw new Error("YESHIVA_IN_USE")
  }

  if (!response.ok) {
    throw new Error("DELETE_FAILED")
  }
}