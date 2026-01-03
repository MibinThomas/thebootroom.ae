import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const PlayerSchema = new Schema(
  {
    fullName: { type: String, required: true },
    jerseyNumber: { type: Number, required: true },
    position: { type: String, required: true },
    jerseySize: { type: String, enum: ["S", "M", "L", "XL", "XXL"], required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const TeamSchema = new Schema(
  {
    teamNumber: { type: Number, required: true, unique: true, index: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    managerName: { type: String, required: true },
    phone: { type: String, required: true },
    captainName: { type: String, required: true },
    captainPhone: { type: String, required: true },
    players: { type: [PlayerSchema], required: true },
    logoFileName: { type: String, required: true },
    brandGuidelinesFileName: { type: String, default: "" },
  },
  { timestamps: true }
);

export type TeamDoc = InferSchemaType<typeof TeamSchema> & { _id: mongoose.Types.ObjectId };

export const Team: Model<TeamDoc> =
  (mongoose.models.Team as Model<TeamDoc>) || mongoose.model<TeamDoc>("Team", TeamSchema);
