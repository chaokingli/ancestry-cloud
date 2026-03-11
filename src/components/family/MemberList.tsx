import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Member = {
  id: string
  name: string
  email?: string
  role: "OWNER" | "ADMIN" | "MEMBER"
}

interface MemberListProps {
  members: Member[]
}

function getRoleVariant(role: Member["role"]) {
  switch (role) {
    case "OWNER":
      return "default"
    case "ADMIN":
      return "secondary"
    case "MEMBER":
      return "outline"
    default:
      return "default"
  }
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>家族成员</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex flex-col">
                <span className="font-medium">{member.name}</span>
                {member.email && (
                  <span className="text-sm text-muted-foreground">
                    {member.email}
                  </span>
                )}
              </div>

              <Badge variant={getRoleVariant(member.role)}>
                {member.role === "ADMIN"
                  ? "管理员"
                  : member.role === "EDITOR"
                  ? "编辑"
                  : member.role === "VIEWER"
                  ? "查看"
                  : "成员"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
