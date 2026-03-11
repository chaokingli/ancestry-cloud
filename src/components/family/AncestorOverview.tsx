import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Ancestor = {
  id: string
  name: string
}

interface AncestorOverviewProps {
  familyId: string
  ancestors: Ancestor[]
}

export function AncestorOverview({ familyId, ancestors }: AncestorOverviewProps) {
  const displayed = ancestors.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>先祖</CardTitle>
        <Button asChild size="sm">
          <Link href={`/families/${familyId}/ancestors/new`}>添加先祖</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {displayed.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无先祖</p>
        ) : (
          <ul className="space-y-2">
            {displayed.map((ancestor) => (
              <li key={ancestor.id}>
                <Link
                  href={`/ancestors/${ancestor.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  {ancestor.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <Link href={`/families/${familyId}/ancestors/new`}>
            添加先祖
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
