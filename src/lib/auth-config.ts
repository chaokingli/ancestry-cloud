import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Adapter for NextAuth with Prisma
const adapter = PrismaAdapter(prisma)

// Custom credential validation using bcrypt
const CredentialsProvider = Credentials({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      return null
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: credentials.email as string },
    })

    if (!user) {
      return null
    }

    // Check if user has password (passwordless accounts)
    if (!user.password) {
      return null
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      credentials.password as string,
      user.password as string
    )

    if (!isPasswordValid) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  },
})

export const authConfig = {
  adapter,
  providers: [CredentialsProvider],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user as { role?: string }).role,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
        },
      }
    },
  },
  secret: process.env.AUTH_SECRET,
  events: {
    async linkAccount({ user }) {
      // Handle account linking
    },
  },
  theme: {
    colorScheme: "light",
  },
} satisfies NextAuthConfig

export default authConfig
