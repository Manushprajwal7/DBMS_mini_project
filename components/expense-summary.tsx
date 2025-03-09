"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowDownIcon, ArrowUpIcon, IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ExpenseSummary({ expenses, isLoading }) {
  const [summary, setSummary] = useState({
    total: 0,
    average: 0,
    highest: { amount: 0, title: "" },
    categories: 0,
  })

  useEffect(() => {
    if (!expenses || expenses.length === 0) {
      setSummary({
        total: 0,
        average: 0,
        highest: { amount: 0, title: "" },
        categories: 0,
      })
      return
    }

    // Calculate total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Calculate average
    const average = total / expenses.length

    // Find highest expense
    const highest = expenses.reduce(
      (max, expense) => (expense.amount > max.amount ? { amount: expense.amount, title: expense.title } : max),
      { amount: 0, title: "" },
    )

    // Count unique categories
    const uniqueCategories = new Set(expenses.map((expense) => expense.category))

    setSummary({
      total,
      average,
      highest,
      categories: uniqueCategories.size,
    })
  }, [expenses])

  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-32 mt-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-32 mt-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Expense</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-32 mt-1" />
          </CardContent>
        </Card>
      </>
    )
  }

  const summaryItems = [
    {
      title: "Total Expenses",
      value: `₹${summary.total.toFixed(2)}`,
      description: `${expenses.length} expense${expenses.length !== 1 ? "s" : ""}`,
      icon: <IndianRupee className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Average Expense",
      value: `₹${summary.average.toFixed(2)}`,
      description: `Across ${summary.categories} categories`,
      icon: <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Highest Expense",
      value: `₹${summary.highest.amount.toFixed(2)}`,
      description: summary.highest.title || "No expenses yet",
      icon: <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  return (
    <>
      {summaryItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  )
}

