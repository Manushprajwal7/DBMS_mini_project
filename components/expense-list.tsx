"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

// Category icon mapping
const categoryIcons = {
  Food: "🍔",
  Transportation: "🚗",
  Entertainment: "🎬",
  Education: "📚",
  Housing: "🏠",
  Utilities: "💡",
  Shopping: "🛍️",
  Health: "🏥",
  Other: "📦",
}

export function ExpenseList({ expenses, onDelete, onEdit, isLoading }) {
  const [expandedId, setExpandedId] = useState(null)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No expenses found</h3>
        <p className="text-muted-foreground mt-1">Add your first expense to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {expenses.map((expense) => (
          <motion.div
            key={expense._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === expense._id ? null : expense._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl" aria-hidden="true">
                          {categoryIcons[expense.category] || "📦"}
                        </span>
                        <h3 className="font-medium">{expense.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{format(new Date(expense.date), "PPP")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{expense.amount.toFixed(2)}</p>
                      <Badge variant="outline" className="mt-1">
                        {expense.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === expense._id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => onEdit(expense)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => onDelete(expense._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

