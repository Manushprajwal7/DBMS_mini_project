import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Expense document
export interface IExpense extends Document {
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Define the schema
const ExpenseSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for this expense."],
    maxlength: [60, "Title cannot be more than 60 characters"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount for this expense."],
    min: [0, "Amount cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Please specify a category for this expense."],
    enum: [
      "Food",
      "Transportation",
      "Entertainment",
      "Education",
      "Housing",
      "Utilities",
      "Shopping",
      "Health",
      "Other",
    ],
  },
  date: {
    type: String,
    required: [true, "Please provide a date for this expense."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Create and export the model
export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
