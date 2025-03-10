import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all expenses
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("budget-tracker");

    // Check if collection exists
    const collections = await db
      .listCollections({ name: "expenses" })
      .toArray();
    if (collections.length === 0) {
      // Create collection if it doesn't exist
      await db.createCollection("expenses");
      console.log("Created expenses collection");
    }

    const expenses = await db
      .collection("expenses")
      .find({})
      .sort({ date: -1 })
      .toArray();

    // Convert MongoDB objects to serializable format
    const transformedExpenses = expenses.map((expense) => {
      // Handle date conversion safely
      const safeDate =
        expense.date instanceof Date ? expense.date : new Date(expense.date);

      return {
        ...expense,
        _id: expense._id.toString(),
        date: safeDate.toISOString(),
        createdAt: expense.createdAt?.toISOString(),
        updatedAt: expense.updatedAt?.toISOString(),
      };
    });

    return NextResponse.json(transformedExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch expenses",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} // <-- MISSING CLOSING BRACKET ADDED HERE ✅

// POST a new expense
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("budget-tracker");
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.amount || !data.category || !data.date) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          received: {
            title: !!data.title,
            amount: !!data.amount,
            category: !!data.category,
            date: !!data.date,
          },
        },
        { status: 400 }
      );
    }

    // Validate amount
    const amount = Number(data.amount);
    if (isNaN(amount)) {
      return NextResponse.json(
        {
          error: "Amount must be a valid number",
          received: data.amount,
        },
        { status: 400 }
      );
    }

    // Validate date
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid date format",
          received: data.date,
        },
        { status: 400 }
      );
    }

    // Create new expense document
    const newExpense = {
      ...data,
      amount: amount,
      date: date,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("expenses").insertOne(newExpense);

    // Return response with stringified ID
    return NextResponse.json(
      {
        ...newExpense,
        _id: result.insertedId.toString(),
        date: newExpense.date.toISOString(),
        createdAt: newExpense.createdAt.toISOString(),
        updatedAt: newExpense.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      {
        error: "Failed to create expense",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
