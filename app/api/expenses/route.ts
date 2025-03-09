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
      // Collection doesn't exist, create it
      await db.createCollection("expenses");
      console.log("Created expenses collection");
    }

    const expenses = await db
      .collection("expenses")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch expenses",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST a new expense
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("budget-tracker");
    const data = await request.json();

    console.log("Received expense data:", data);

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

    // Ensure amount is a number
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

    // Ensure date is valid
    try {
      new Date(data.date);
    } catch (e) {
      return NextResponse.json(
        {
          error: "Date must be a valid date string",
          received: data.date,
        },
        { status: 400 }
      );
    }

    const result = await db.collection("expenses").insertOne({
      ...data,
      amount: amount,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...data,
        amount: amount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      {
        error: "Failed to create expense",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET a single expense
export async function GET_BY_ID(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("budget-tracker");

    const expense = await db
      .collection("expenses")
      .findOne({ _id: new ObjectId(params.id) });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

// PUT to update an expense
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("budget-tracker");
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.amount || !data.category || !data.date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.collection("expenses").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          title: data.title,
          amount: Number(data.amount),
          category: data.category,
          date: data.date,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: params.id,
      ...data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update expense" },
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

    const result = await db
      .collection("expenses")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
