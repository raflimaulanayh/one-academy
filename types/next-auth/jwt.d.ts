import { Role } from '.'

declare module 'next-auth/jwt' {
  interface JWT {
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
