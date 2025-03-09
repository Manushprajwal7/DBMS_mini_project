"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"

// Define the filter options
const CATEGORIES = [
  "All Categories",
  "Food",
  "Transportation",
  "Entertainment",
  "Education",
  "Housing",
  "Utilities",
  "Shopping",
  "Health",
  "Other",
]

export function ExpenseFilter({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: "All Categories",
    minAmount: "",
    maxAmount: "",
    dateRange: undefined,
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Transform dateRange to startDate and endDate for the parent component
    const transformedFilters = { ...newFilters }
    if (newFilters.dateRange) {
      transformedFilters.startDate = newFilters.dateRange.from
      transformedFilters.endDate = newFilters.dateRange.to
      delete transformedFilters.dateRange
    } else {
      transformedFilters.startDate = null
      transformedFilters.endDate = null
    }

    onFilterChange(transformedFilters)
  }

  const resetFilters = () => {
    const defaultFilters = {
      category: "All Categories",
      minAmount: "",
      maxAmount: "",
      dateRange: undefined,
    }
    setFilters(defaultFilters)
    onFilterChange({
      category: "All Categories",
      minAmount: "",
      maxAmount: "",
      startDate: null,
      endDate: null,
    })
  }

  const activeFilterCount = Object.values(filters).filter((value) => {
    if (value === null || value === "" || value === undefined) return false
    if (value === "All Categories") return false
    return true
  }).length

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="mt-2">
            <CardContent className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minAmount">Min Amount (₹)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  placeholder="0"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAmount">Max Amount (₹)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  placeholder="No limit"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <DateRangePicker
                  value={filters.dateRange}
                  onChange={(range) => handleFilterChange("dateRange", range)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

