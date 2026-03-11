import * as React from "react"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface FamilyProfileCardProps {
  familyName: string
  description?: string
  createdAt?: string
  memberCount?: number
  ancestorCount?: number
}

export function FamilyProfileCard({
  familyName,
  description,
  createdAt,
  memberCount,
  ancestorCount,
}: FamilyProfileCardProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : undefined

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{familyName}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
        {formattedDate && (
          <p className="text-xs text-muted-foreground">
            Created {formattedDate}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          {typeof memberCount === "number" && (
            <Badge variant="secondary">Members: {memberCount}</Badge>
          )}

          {typeof ancestorCount === "number" && (
            <Badge variant="outline">Ancestors: {ancestorCount}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
