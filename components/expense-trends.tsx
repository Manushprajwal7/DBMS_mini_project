"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function ExpenseTrends({ expenses, isLoading }) {
  const [data, setData] = useState([])

  useEffect(() => {
    if (!expenses || expenses.length === 0) return

    // Get the last 6 months
    const today = new Date()
    const sixMonthsAgo = subMonths(today, 5)

    // Create an array of all months in the range
    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(today),
    })

    // Initialize data with 0 for each month
    const monthlyData = months.map((month) => ({
      month: format(month, "MMM yyyy"),
      total: 0,
      date: month,
    }))

    // Sum expenses for each month
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date)
      const monthIndex = monthlyData.findIndex(
        (item) => expenseDate >= startOfMonth(item.date) && expenseDate <= endOfMonth(item.date),
      )

      if (monthIndex !== -1) {
        monthlyData[monthIndex].total += expense.amount
      }
    })

    setData(monthlyData)
  }, [expenses])

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-center">
        <div>
          <p className="text-muted-foreground">No data to display</p>
          <p className="text-sm text-muted-foreground">Add expenses to see your monthly trends</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `₹${value}`} />
          <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorTotal)"
            name="Total Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

