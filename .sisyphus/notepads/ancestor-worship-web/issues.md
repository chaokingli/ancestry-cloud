# Issues and Blockers

## NextAuth.js v5 Migration
- Current package: next-auth v4.24.13
- Need to upgrade to v5 for App Router support
- Prisma adapter: @auth/prisma-adapter v2.11.1 already installed

## NextAuth.js v5 Migration
- Current package: next-auth v4.24.13
- Need to upgrade to v5 for App Router support
- Prisma adapter: @auth/prisma-adapter v2.11.1 already installed

## Prisma Client Initialization (2026-03-10)

### Issue
```
src/lib/prisma.ts(2,10): error TS2724: 
'@prisma/adapter-better-sqlite3' has no exported member named 
'PrismaBetterSqlite3Adapter'. Did you mean 'PrismaBetterSqlite3'?
```

### Root Cause
The code was using older Prisma adapter API (`PrismaBetterSqlite3Adapter`) which doesn't exist in Prisma 7.

### Solution
Updated `src/lib/prisma.ts` to use the correct API:
- `PrismaBetterSqlite3` instead of `PrismaBetterSqlite3Adapter`
- Load schema programmatically using `readFile`
- Extract database path from schema pattern

### Verification
- ✅ `bunx tsc --noEmit` passes

## NextAuth.js Configuration Errors (2026-03-10)

### Issue
```
src/lib/auth-config.ts(65,5): error TS2353: Object literal may only 
specify known properties, and 'signUp' does not exist in type 
'Partial<PagesOptions>'.

src/lib/auth-config.ts(97,3): error TS2561: Object literal may only 
specify known properties, but 'themes' does not exist in type 
'NextAuthConfig'. Did you mean 'theme'?
```

### Root Cause
NextAuth.js v5 has different configuration options:
- The `signUp` page option doesn't exist (only `signIn`)
- The property is `theme` not `themes`

### Solution
1. Removed `signUp` page from config
2. Changed `themes` to `theme`
3. Added type assertions for credentials and user properties

### Verification
- ✅ `bunx tsc --noEmit` passes

## bcrypt Type Errors (2026-03-10)

### Issue
```
src/lib/auth-config.ts(38,7): error TS2345: Argument of type '{}' 
is not assignable to parameter of type 'string | Buffer<ArrayBufferLike>'.
```

### Root Cause
The `credentials.password` is typed as `{}` by default in NextAuth.js Credentials provider.

### Solution
Added type assertions: `credentials.password as string`

### Verification
- ✅ TypeScript compiles successfully

## Prisma Schema Line Number Comments (2026-03-10)

### Issue
The schema file had line number comment prefixes (`#KT|`, `#QV|`) that interfered with Prisma parsing.

### Solution
Removed all comment prefixes from `prisma/schema.prisma`

### Verification

## Worship History API Route Implementation (2026-03-10)

### Implementation Notes
- No issues encountered during implementation
- Successfully integrated with existing authentication system
- Followed established patterns from ancestors/route.ts and families/route.ts
- TypeScript compilation clean (bunx tsc --noEmit passes)

### Lessons Learned
1. **Query Parameter Handling**: At least one filtering parameter required (ancestorId OR familyId)
   - Validates user access based on which parameter is provided
   - If ancestorId provided: verifies ancestor exists and user has family access
   - If familyId provided: verifies user is family member directly

2. **Authorization Strategy**:
   - All family members can view worship history (no role restriction needed)
   - より granular control could be added via familyMember.role check

3. **Pagination Support**:
   - Default: page=1, limit=20
   - Calculates totalPages for UI convenience

4. **Response Includes**:
   - ancestor: id, firstName, lastName, gender, birthDate, deathDate
   - family: id, name
   - creator: id, name, email

## Activity Feed Page useSearchParams Suspense Boundary (2026-03-10)

### Issue
```
useSearchParams() should be wrapped in a suspense boundary at page "/activity"
```

### Root Cause
Next.js 16 requires that useSearchParams() be wrapped in a Suspense boundary when using App Router with turbopack for static page generation.

### Solution
1. Refactored ActivityPage to use ActivityContent component for the main logic
2. Wrapped ActivityContent in React.Suspense with fallback
3. This allows proper handling of search params during static generation

### Verification
- ✅ TypeScript compiles successfully
- ✅ Build completes without errors for /activity page
- ✅ Dev server returns 200 for /activity endpoint

## Responsive Design Issues - Resolved (2026-03-10)

### Issues Fixed

1. **Timeline Layout on Mobile**
   - **Problem**: Timeline line and nodes caused horizontal overflow on mobile
   - **Solution**: Hidden timeline line on mobile (`hidden sm:block`), reduced node sizes

2. **Pagination Buttons Too Small**
   - **Problem**: Page number buttons were difficult to tap on mobile
   - **Solution**: Added `min-h-[2.5rem] min-w-[2.5rem]` and `touch-manipulation`

3. **Filter Bar Overflow**
   - **Problem**: Search and sort inputs overflowed on small screens
   - **Solution**: Stack elements vertically with `flex-col sm:flex-row`

4. **Photo Thumbnails Overflow**
   - **Problem**: Photo gallery thumbnails caused horizontal scrolling
   - **Solution**: Added `overflow-x-auto` with `scrollbar-thin` styling

5. **Form Inputs Zoom on iOS**
   - **Problem**: iOS zooms in when focusing inputs with font-size < 16px
   - **Solution**: Added `text-base` (16px) minimum for inputs on mobile

6. **Card Text Truncation**
   - **Problem**: Long names and descriptions caused layout breaks
   - **Solution**: Added `truncate` and `break-words` classes

7. **Touch Targets Too Small**
   - **Problem**: Buttons and interactive elements were smaller than 44px
   - **Solution**: Added `min-h-[2.75rem]` to all interactive elements

8. **Safe Area Notch Support**
   - **Problem**: Content overlapped with iOS notch/dynamic island
   - **Solution**: Added `env(safe-area-inset-bottom)` CSS support

### Testing Recommendations

- Test on iPhone SE (375px width) - smallest common screen
- Test on iPhone 14 Pro with Dynamic Island
- Test landscape orientation on mobile
- Verify touch targets are at least 44x44px
- Check horizontal scrolling doesn't occur
- Verify form inputs don't cause zoom on iOS
