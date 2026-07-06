import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/** A service enquiry submitted from a /services/[slug] page — a finance
 *  request, sourcing brief, valuation request or aftercare enrolment. */
const EnquirySchema = new Schema(
  {
    /** Service slug (financing, sourcing, trade-in, aftercare). */
    service: { type: String, required: true },
    serviceTitle: String,
    name: { type: String, required: true },
    email: { type: String, required: true },
    /** Optional phone number. */
    phone: String,
    /** Whitelisted service-specific fields (see data/enquiryFields.ts). */
    details: { type: Map, of: String },
    /** Optional free-text note from the customer. */
    message: String,
    /** Workflow state shown in the admin panel. */
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export type EnquiryDoc = InferSchemaType<typeof EnquirySchema> & { _id: unknown };

export const EnquiryModel: Model<EnquiryDoc> =
  (models.Enquiry as Model<EnquiryDoc>) ?? model<EnquiryDoc>("Enquiry", EnquirySchema);
