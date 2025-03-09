"use client"

import { ArrowDownAZ, ArrowDownUp, ArrowUpAZ, Calendar, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ExpenseSort({ onSortChange, currentSort }) {
  const sortOptions = [
    { id: "date-desc", label: "Date (Newest first)", icon: Calendar },
    { id: "date-asc", label: "Date (Oldest first)", icon: Calendar },
    { id: "amount-desc", label: "Amount (Highest first)", icon: IndianRupee },
    { id: "amount-asc", label: "Amount (Lowest first)", icon: IndianRupee },
    { id: "title-asc", label: "Title (A-Z)", icon: ArrowDownAZ },
    { id: "title-desc", label: "Title (Z-A)", icon: ArrowUpAZ },
  ]

  const currentSortOption = sortOptions.find((option) => option.id === currentSort) || sortOptions[0]
  const Icon = currentSortOption.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ArrowDownUp className="h-4 w-4" />
          <span className="hidden sm:inline-block">Sort by:</span>
          <span className="font-medium">{currentSortOption.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem key={option.id} className="flex items-center gap-2" onClick={() => onSortChange(option.id)}>
            <option.icon className="h-4 w-4" />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

