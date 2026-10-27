

const API_URL = "http://localhost:5095/api"


interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    fullName: string
  }
}
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    }
  )

  if (!response.ok) {
    throw new Error("Failed to login")
  }

  return response.json()
}


export async function registerApi(
  fullName:string,
  email: string,
  password: string,
 
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({fullName, email, password })
    }
  )

  if (!response.ok) {
    throw new Error("Failed to register")
  }

  return response.json()
}
