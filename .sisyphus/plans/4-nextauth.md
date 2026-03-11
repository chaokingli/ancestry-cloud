# .sisyphus/plans/4-nextauth.md
# Task 4: NextAuth.js Authentication Configuration

## Files Created

### src/lib/auth.ts
- NextAuth configuration with Credentials provider
- Email/password authentication
- JWT-based session management
- Custom session callbacks with role support

### .env
- Added AUTH_SECRET for encryption

### prisma/schema.prisma (updated)
- Added password field to User model
- Added emailVerified field to User model
- Added Session, Account, VerificationToken models for NextAuth

## Files Created (Not Used Due to App Router Limitations)

### src/middleware.ts
- Middleware for route protection
- Uses getServerSession (requires pages router)

### src/app/api/auth/[...nextauth]/route.ts
- Route handler (requires proper configuration for App Router)

## Implementation Notes

1. NextAuth.js v4 has limited support for Next.js 16 App Router
2. For full App Router support, NextAuth.js v5 is recommended
3.当前 implementation uses lib/auth.ts with getServerSession pattern
4. Middleware requires pages router pattern for NextAuth v4
5. For App Router, the route.ts would need to be a true API route handler

## How to Use

1. Add AUTH_SECRET to .env:
   ```
   AUTH_SECRET=your-secret-key-here
   ```

2. Run `npx prisma migrate dev` to create the database tables

3. Create login page at src/app/login/page.tsx

4. Protect routes using getServerSession from lib/auth:
   ```ts
   import { authOptions } from "@/lib/auth"
   import { getServerSession } from "next-auth"

   const session = await getServerSession(authOptions)
   ```

## Next Steps

1. Install bcrypt for password hashing (currently placeholder)
2. Create login page component
3. Create protected routes
4. Implement registration flow
