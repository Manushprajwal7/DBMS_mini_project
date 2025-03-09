import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single expense
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("budget-tracker")

    const expense = await db.collection("expenses").findOne({ _id: new ObjectId(params.id) })

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expense" }, { status: 500 })
  }
}

// PUT to update an expense
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("budget-tracker")
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.amount || !data.category || !data.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json({
      _id: params.id,
      ...data,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 })
  }
}

// DELETE an expense
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("budget-tracker")

    const result = await db.collection("expenses").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 })
  }
}

