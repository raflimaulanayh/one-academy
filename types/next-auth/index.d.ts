import 'next-auth'

export type Role = 'admin' | 'customer'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    role: Role
    token: string
    accountComplete: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
      accountComplete: boolean
    }
    jwt: string
  }
}
