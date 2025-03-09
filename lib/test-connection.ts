import clientPromise from "@/lib/mongodb";

export async function testMongoDBConnection() {
  try {
    // Attempt to connect to MongoDB
    const client = await clientPromise;
    console.log("MongoDB connection successful!");

    // Test database access
    const db = client.db("budget-tracker");
    const collections = await db.listCollections().toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    return {
      success: true,
      message: "Connection successful",
      collections: collections.map((c) => c.name),
    };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return {
      success: false,
      message: error.message,
      error,
    };
  }
}
