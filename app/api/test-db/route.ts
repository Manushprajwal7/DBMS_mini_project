import { NextResponse } from "next/server";
import { testMongoDBConnection } from "@/lib/test-connection";

export async function GET() {
  try {
    const result = await testMongoDBConnection();

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to test database connection",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
