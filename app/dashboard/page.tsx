"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseList } from "@/components/expense-list";
import { ExpenseChart } from "@/components/expense-chart";
import { ExpenseSummary } from "@/components/expense-summary";
import { ExpenseFilter } from "@/components/expense-filter";
import { ExpenseSort } from "@/components/expense-sort";
import { ExpenseExport } from "@/components/expense-export";
import { ExpenseTrends } from "@/components/expense-trends";

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chartType, setChartType] = useState("pie");
  const [sortOption, setSortOption] = useState("date-desc");
  const [filters, setFilters] = useState({
    category: "All Categories",
    minAmount: "",
    maxAmount: "",
    startDate: null,
    endDate: null,
  });

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok) throw new Error("Failed to fetch expenses");
        const data = await response.json();
        setExpenses(data);
        setFilteredExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast({
          title: "Error",
          description: "Failed to load expenses. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [toast]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...expenses];

    // Apply filters
    if (filters.category && filters.category !== "All Categories") {
      result = result.filter(
        (expense) => expense.category === filters.category
      );
    }

    if (filters.minAmount) {
      result = result.filter(
        (expense) => expense.amount >= Number(filters.minAmount)
      );
    }

    if (filters.maxAmount) {
      result = result.filter(
        (expense) => expense.amount <= Number(filters.maxAmount)
      );
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter((expense) => new Date(expense.date) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter((expense) => new Date(expense.date) <= endDate);
    }

    // Apply sorting
    result = sortExpenses(result, sortOption);

    setFilteredExpenses(result);
  }, [expenses, filters, sortOption]);

  // Sort expenses based on the selected option
  const sortExpenses = (expensesToSort, option) => {
    const sorted = [...expensesToSort];

    switch (option) {
      case "date-desc":
        return sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "date-asc":
        return sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "amount-desc":
        return sorted.sort((a, b) => b.amount - a.amount);
      case "amount-asc":
        return sorted.sort((a, b) => a.amount - b.amount);
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle sort changes
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    setIsLoading(true);

    try {
      if (currentExpense) {
        // Update existing expense
        const response = await fetch(`/api/expenses/${currentExpense._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to update expense");

        const updatedExpense = await response.json();
        setExpenses(
          expenses.map((exp) =>
            exp._id === updatedExpense._id ? updatedExpense : exp
          )
        );

        toast({
          title: "Expense updated",
          description: "Your expense has been updated successfully.",
        });
      } else {
        // Create new expense
        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to create expense");

        const newExpense = await response.json();
        setExpenses([newExpense, ...expenses]);

        toast({
          title: "Expense added",
          description: "Your expense has been added successfully.",
        });
      }

      setIsFormOpen(false);
      setCurrentExpense(null);
    } catch (error) {
      console.error("Error saving expense:", error);
      toast({
        title: "Error",
        description: "Failed to save expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle expense edit
  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setIsFormOpen(true);
  };

  // Handle expense delete
  const handleDelete = async (id) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Confirm expense delete
  const confirmDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/expenses/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete expense");

      setExpenses(expenses.filter((exp) => exp._id !== deleteId));

      toast({
        title: "Expense deleted",
        description: "Your expense has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your expenses and track your spending
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentExpense ? "Edit Expense" : "Add Expense"}
              </DialogTitle>
              <DialogDescription>
                {currentExpense
                  ? "Update your expense details below."
                  : "Enter the details of your expense below."}
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm
              onSubmit={handleFormSubmit}
              defaultValues={currentExpense}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <ExpenseSummary expenses={filteredExpenses} isLoading={isLoading} />
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trends</CardTitle>
            <CardDescription>
              View your spending patterns over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseTrends expenses={expenses} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  Visualize your spending by category
                </CardDescription>
              </div>
              <Tabs
                defaultValue="pie"
                value={chartType}
                onValueChange={setChartType}
              >
                <TabsList>
                  <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ExpenseChart
              expenses={filteredExpenses}
              type={chartType}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>
                  {filteredExpenses.length} expense
                  {filteredExpenses.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <ExpenseSort
                  onSortChange={handleSortChange}
                  currentSort={sortOption}
                />
                <ExpenseExport expenses={filteredExpenses} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ExpenseFilter onFilterChange={handleFilterChange} />
            <ExpenseList
              expenses={filteredExpenses}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expense from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
