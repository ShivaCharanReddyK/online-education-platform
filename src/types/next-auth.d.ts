import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'student' | 'counselor'
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: 'student' | 'counselor'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'student' | 'counselor'
  }
}
