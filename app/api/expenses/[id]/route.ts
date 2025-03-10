import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET single expense
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("budget-tracker");

    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid expense ID format" },
        { status: 400 }
      );
    }

    const expense = await db
      .collection("expenses")
      .findOne({ _id: new ObjectId(params.id) });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Convert MongoDB object to serializable format
    const transformedExpense = {
      ...expense,
      _id: expense._id.toString(),
      date: (expense.date instanceof Date
        ? expense.date
        : new Date(expense.date)
      ).toISOString(),
      createdAt: expense.createdAt?.toISOString(),
      updatedAt: expense.updatedAt?.toISOString(),
    };

    return NextResponse.json(transformedExpense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch expense",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT update an expense
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("budget-tracker");
    const data = await request.json();

    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid expense ID format" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!data.title || !data.amount || !data.category || !data.date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate amount
    const amount = Number(data.amount);
    if (isNaN(amount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number" },
        { status: 400 }
      );
    }

    // Validate date
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const updateData = {
      title: data.title,
      amount: amount,
      category: data.category,
      date: date,
      updatedAt: new Date(),
    };

    const result = await db
      .collection("expenses")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Return updated expense data
    return NextResponse.json({
      ...updateData,
      _id: params.id,
      date: date.toISOString(),
      updatedAt: updateData.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      {
        error: "Failed to update expense",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE an expense
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("budget-tracker");

    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid expense ID format" },
        { status: 400 }
      );
    }

    const result = await db
      .collection("expenses")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      {
        error: "Failed to delete expense",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
