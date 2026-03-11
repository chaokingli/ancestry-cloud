'use client'

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type FamilyHeaderProps = {
  familyId: string
  familyName: string
}

export default function FamilyHeader({ familyId, familyName }: FamilyHeaderProps) {
  const handleInvite = () => {
    console.log("Invite Member clicked for family:", familyId)
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">{familyName}</h1>

      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href={`/families/${familyId}/ancestors/new`}>
            Add Ancestor
          </Link>
        </Button>

        <Button variant="outline" onClick={handleInvite}>
          Invite Member
        </Button>
      </div>
    </div>
  )
}
