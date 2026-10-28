import type { GroupClass } from "../types/GroupClass"

import { API_URL } from "../config/api"
export async function getClasses(
  groupId: string,
  token: string
): Promise<GroupClass[]> {

  const response = await fetch(
    `${API_URL}/groups/${groupId}/classes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to load classes")
  }

  return response.json()
}


export async function addClass(
  groupId: string,
  token: string,
  name:string
): Promise<GroupClass> {

  const response = await fetch(
    `${API_URL}/groups/${groupId}/classes`,
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
    throw new Error("Failed to add class")
  }

  return response.json()
}

export async function deleteClass(
  groupId: string,
  token: string,
  classId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/classes/${classId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if(response.status === 409){
     throw new Error("CLASS_IN_USE")
  }

  if (!response.ok) {
    throw new Error("Failed to delete class")
  }
}