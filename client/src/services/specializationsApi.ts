import type { GroupSpecializations } from "../types/GroupSpecializations"

import { API_URL } from "../config/api"
export async function getSpecializations(
  groupId: string,
  token: string
): Promise<GroupSpecializations[]> {

  const response = await fetch(
    `${API_URL}/groups/${groupId}/specializations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to load specializations")
  }

  return response.json()
}

export async function addSpecialization(
  groupId: string,
  token: string,
  name:string
): Promise<GroupSpecializations> {

  const response = await fetch(
    `${API_URL}/groups/${groupId}/specializations`,
    {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify({name})
    }
  )

  if (!response.ok) {
    throw new Error("Failed to add Specialization")
  }

  return response.json()
}

export async function deleteSpecialization(
  groupId: string,
  token: string,
  specializationId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/specializations/${specializationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (response.status === 409) {
    throw new Error("SPECIALIZATION_IN_USE")
  }

  if (!response.ok) {
    throw new Error("DELETE_FAILED")
  }
}