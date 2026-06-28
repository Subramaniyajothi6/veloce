import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/** A test-drive request submitted from /test-drive. */
const BookingSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    /** Optional phone number. */
    phone: String,
    carSlug: { type: String, required: true },
    carName: String,
    location: { type: String, required: true },
    /** ISO date string (YYYY-MM-DD) the customer picked. */
    date: { type: String, required: true },
    /** Optional free-text note from the customer. */
    message: String,
    /** Workflow state shown in the admin panel. */
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export type BookingDoc = InferSchemaType<typeof BookingSchema> & { _id: unknown };

export const BookingModel: Model<BookingDoc> =
  (models.Booking as Model<BookingDoc>) ?? model<BookingDoc>("Booking", BookingSchema);
