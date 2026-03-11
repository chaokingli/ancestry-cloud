# Family Dashboard Development Plan

Target Page: `src/app/families/[id]/page.tsx`

## 1. Purpose of the Page

The Family Dashboard serves as the central management interface for a specific family. It allows authorized family members to manage family information, view and manage members, track ancestors, invite new members, and observe recent activity within the family space.

Primary goals:
- Provide a clear overview of a family's structure and activity.
- Allow administrators to manage membership and invitations.
- Provide quick access to ancestors belonging to the family.
- Act as the navigation hub for all family-scoped features.

## 2. Core Modules

### Family Profile
Displays high-level information about the family.

Responsibilities:
- Family name
- Family description
- Creation date
- Owner / administrators
- Edit profile (admin only)

### Members
Shows current family members and their roles.

Responsibilities:
- List all members
- Display role (Owner, Admin, Member)
- Remove member (admin only)
- Promote/demote roles

### Ancestors Overview
Quick summary of ancestors belonging to the family.

Responsibilities:
- Display ancestor count
- Show recently added ancestors
- Provide link to ancestors list
- Provide "Add ancestor" action

### Invitations
Manage pending invitations to join the family.

Responsibilities:
- Display pending invitations
- Show invite email
- Show status (pending / accepted / expired)
- Revoke invitation
- Send new invitation

### Activity
Recent activity feed related to the family.

Examples:
- New ancestor added
- Worship activity logged
- Member joined
- Eulogy created

## 3. Page Layout Design

The page follows a dashboard layout with sections arranged vertically.

Layout structure:

- Header
  - Family name
  - Edit button (admin)

- Main dashboard grid

  Left column
  - Family Profile Card
  - Members Card

  Right column
  - Ancestors Overview Card
  - Invitations Card

- Activity Feed (full width section)

Suggested grid structure:

- Desktop: 2-column grid
- Tablet/Mobile: stacked layout

## 4. Required APIs

The dashboard depends on several API endpoints.

Family data
- `GET /api/families/{id}`

Members
- `GET /api/members?familyId={id}`
- `PATCH /api/members/{memberId}` (role update)
- `DELETE /api/members/{memberId}`

Ancestors
- `GET /api/ancestors?familyId={id}`

Invitations
- `GET /api/invitations?familyId={id}`
- `POST /api/invitations`
- `DELETE /api/invitations/{id}`

Activity
- `GET /api/activity?familyId={id}`

## 5. Component Structure

Components should live under:

`src/components/family/`

Recommended structure:

- `FamilyProfileCard.tsx`
- `FamilyMembersCard.tsx`
- `FamilyAncestorsOverview.tsx`
- `FamilyInvitationsCard.tsx`
- `FamilyActivityFeed.tsx`

Shared utilities:

- `FamilyMemberListItem.tsx`
- `InvitationRow.tsx`

These components should be designed as reusable UI units for other family-related pages.

## 6. Data Loading Strategy

Use a hybrid approach leveraging Next.js Server Components.

Server components:
- Load primary family data
- Load members
- Load ancestor counts

Client components:
- Member role management
- Invitation sending
- Removing members
- Live UI interactions

Recommended pattern:

Server page (`page.tsx`)
- Fetch family
- Fetch members
- Fetch ancestor summary

Client widgets
- Invitations manager
- Activity feed (optional polling)

## 7. Navigation Relationships

The family dashboard acts as a navigation hub for family-specific pages.

Related routes:

- `src/app/families/page.tsx`
  - Family list

- `src/app/families/[id]/ancestors`
  - Family ancestor list

- `src/app/families/[id]/ancestors/new`
  - Add new ancestor

Potential future routes:

- `/families/[id]/members`
- `/families/[id]/settings`

## 8. MVP Scope

Minimum implementation for initial release:

Include:
- Family profile display
- Member list
- Ancestor summary
- Invitation list
- Send invitation

Exclude for MVP:
- Full activity feed
- Advanced role management
- Analytics or statistics

## 9. Future Extensibility

Potential future improvements:

- Family timeline visualization
- Family tree relationship view
- Member permissions system
- Real-time activity updates
- Family document archive
- Multi-family switching

The dashboard should be designed with modular components so new sections can be added without restructuring the page layout.
