import mongoose, { Schema, Document } from "mongoose";

export interface Credits extends Document {
  credits: number;
  isPaid: boolean;
  planName: string;
  planId: number;
}

const creditsSchema: Schema<Credits> = new Schema(
  {
    credits: {
      type: Number,
      required: true,
      default: 10,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    planName: {
      type: String,
      required: true,
      default: "free",
    },
    planId: {
      type: Number,
      required: true,
      default: null,
    },
  },
  { timestamps: true }
);

const CreditsModel =
  (mongoose.models.Credits as mongoose.Model<Credits>) ||
  mongoose.model<Credits>("Credits", creditsSchema);

export default CreditsModel;
