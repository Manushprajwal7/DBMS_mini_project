"use client"

import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { exportToCSV, exportToPDF } from "@/lib/export-utils"
import { useState } from "react"

export function ExpenseExport({ expenses }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = () => {
    exportToCSV(expenses, `expenses-${new Date().toISOString().split("T")[0]}.csv`)
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportToPDF(expenses, `expenses-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error exporting to PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2" disabled={isExporting}>
          <Download className="h-4 w-4" />
          <span>{isExporting ? "Exporting..." : "Export"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

