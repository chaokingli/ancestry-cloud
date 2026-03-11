'use client'

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Invitation = {
  id: string
  email?: string
  token: string
}

interface InvitationPanelProps {
  invitations?: Invitation[]
}

export function InvitationPanel({ invitations }: InvitationPanelProps) {
  const handleCopy = async (token: string) => {
    const link = `${window.location.origin}/api/invitations/${token}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // noop
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>邀请</CardTitle>
      </CardHeader>
      <CardContent>
        {!invitations || invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无邀请</p>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <span className="text-sm">
                  {inv.email ? inv.email : inv.token}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(inv.token)}
                >
                  复制邀请链接
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
