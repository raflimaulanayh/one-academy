import type { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Role } from 'types/next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
          const headers: HeadersInit = { 'Content-Type': 'application/json' }

          if (req?.headers?.cookie) {
            headers.cookie = req.headers.cookie
          }

          const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          if (!response.ok) {
            console.error('Login API error:', response.status)

            return null
          }

          const data = await response.json()

          if (data.success && data.user) {
            return {
              id: data.user.id.toString(),
              email: data.user.email,
              name: data.user.name,
              role: data.user.role as Role,
              token: data.token,
              accountComplete: data.user.accountComplete ?? false
            }
          }

          console.error('Login failed:', data.error || 'Unknown error')

          return null
        } catch (error) {
          console.error('Auth error:', error)

          return null
        }
      }
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60
  },

  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login'
  },

  callbacks: {
    async signIn({ user }) {
      return !!user
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          accountComplete: user.accountComplete
        }
        token.jwt = user.token
      }

      return token
    },

    async session({ session, token }) {
      if (token.user) {
        session.user.id = token.user.id
        session.user.email = token.user.email
        session.user.name = token.user.name
        session.user.role = token.user.role
        session.user.accountComplete = token.user.accountComplete
        session.jwt = token.jwt as string
      }

      return session
    }
  },

  debug: process.env.NODE_ENV === 'development'
}
