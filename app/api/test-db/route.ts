import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Test Connection
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("budget-tracker");
    const expenses = await db.collection("expenses").find().toArray();
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}
