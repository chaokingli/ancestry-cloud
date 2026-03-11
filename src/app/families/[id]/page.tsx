import FamilyHeader from "@/components/family/FamilyHeader"
import { FamilyProfileCard } from "@/components/family/FamilyProfileCard"
import MemberList from "@/components/family/MemberList"
import { AncestorOverview } from "@/components/family/AncestorOverview"
import { InvitationPanel } from "@/components/family/InvitationPanel"
import { FamilyActivityFeed } from "@/components/family/FamilyActivityFeed"

interface PageProps {
  params: {
    id: string
  }
}

export default async function FamilyDashboardPage({ params }: PageProps) {
  const familyId = params.id

  let familyName = "家族"
  let members: any[] = []
  let ancestors: any[] = []
  let invitations: any[] = []
  let activities: any[] = []

  try {
    const membersRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/members?familyId=${familyId}`, { cache: "no-store" })
    if (membersRes.ok) {
      const data = await membersRes.json()
      members = (data.members || []).map((m: any) => ({
        id: m.id,
        name: m.user?.name || "未命名成员",
        email: m.user?.email,
        role: m.role,
      }))
    }

    const ancestorsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/ancestors?familyId=${familyId}&limit=5`, { cache: "no-store" })
    if (ancestorsRes.ok) {
      const data = await ancestorsRes.json()
      ancestors = (data.ancestors || []).map((a: any) => ({
        id: a.id,
        name: `${a.firstName}${a.lastName || ""}`,
      }))
    }
  } catch (e) {
    console.error("Family dashboard load error", e)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <FamilyHeader familyId={familyId} familyName={familyName} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FamilyProfileCard
            familyName={familyName}
            description="家族成员共同维护的祖先与家族文化空间"
            createdAt={undefined}
            memberCount={members.length}
            ancestorCount={ancestors.length}
          />

          <MemberList members={members} />
        </div>

        <div className="space-y-6">
          <AncestorOverview familyId={familyId} ancestors={ancestors} />

          <InvitationPanel invitations={invitations} />
        </div>
      </div>

      <FamilyActivityFeed activities={activities} />
    </div>
  )
}
