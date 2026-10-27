



const API_URL = "http://localhost:5095/api"

interface Group {
  id: string
  joinCode: string
  name: string
  role: string
}


export async function getGroups(
  token: string
): Promise<Group[]> {
  const response = await fetch(
    `${API_URL}/groups`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to load groups")
  }

  return response.json()
}

export async function joinGroup(
  token: string,
  joinCode:string
): Promise<Group> {
  const response = await fetch(
    `${API_URL}/groups/join`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ joinCode })
    }
  )

  if (!response.ok) {
    throw new Error("Failed to join")
  }

  return response.json()
}


export async function createGroup(
  token: string,
  name:string
): Promise<Group> {
  const response = await fetch(
    `${API_URL}/groups`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name })
    }
  )

  if (!response.ok) {
    throw new Error("Failed to create group")
  }

  return response.json()
}

export async function deleteGroup(
  groupId: string,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  

  if (!response.ok) {
    throw new Error("Failed to delete group")
  }
}


export async function leaveGroup(
  groupId: string,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/groups/${groupId}/leave`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  

  if (!response.ok) {
    throw new Error("Failed to leave group")
  }
}

