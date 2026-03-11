import * as React from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Activity = {
  id: string
  message: string
  createdAt: string
}

interface FamilyActivityFeedProps {
  activities?: Activity[]
}

export function FamilyActivityFeed({ activities }: FamilyActivityFeedProps) {
  const hasActivities = activities && activities.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>家族动态</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasActivities && (
          <p className="text-sm text-muted-foreground">暂无动态</p>
        )}

        {hasActivities && (
          <div className="space-y-4">
            {activities!.map((activity) => (
              <div key={activity.id} className="flex flex-col">
                <span className="text-sm">{activity.message}</span>
                <span className="text-xs text-muted-foreground">
                  {activity.createdAt}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
