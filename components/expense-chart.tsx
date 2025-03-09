"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

// Category color mapping
const COLORS = [
  "#FF6384", // Red
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40", // Orange
  "#8AC926", // Green
  "#F15BB5", // Pink
  "#9C89B8", // Lavender
]

export function ExpenseChart({ expenses, type = "pie", isLoading }) {
  const [data, setData] = useState([])

  useEffect(() => {
    if (!expenses || expenses.length === 0) return

    // Group expenses by category
    const categoryMap = {}

    expenses.forEach((expense) => {
      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = 0
      }
      categoryMap[expense.category] += expense.amount
    })

    // Convert to array format for charts
    const chartData = Object.keys(categoryMap).map((category, index) => ({
      name: category,
      value: categoryMap[category],
      color: COLORS[index % COLORS.length],
    }))

    // Sort by value (highest first)
    chartData.sort((a, b) => b.value - a.value)

    setData(chartData)
  }, [expenses])

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-center">
        <div>
          <p className="text-muted-foreground">No data to display</p>
          <p className="text-sm text-muted-foreground">Add expenses to see your spending breakdown</p>
        </div>
      </div>
    )
  }

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
      </PieChart>
    </ResponsiveContainer>
  )

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `₹${value}`} />
        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {type === "pie" ? renderPieChart() : renderBarChart()}
    </motion.div>
  )
}

