import { Division, Forfeit, League, MatchType } from "@/types/match";
import mongoose, { Schema, Model } from "mongoose";



export type MatchDoc = mongoose.HydratedDocument<MatchType>;

const matchSchema = new Schema<MatchType>(
  {
    teamOneName: { type: String, required: true, trim: true },
    teamTwoName: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    division: {
      type: String,
      enum: Division,
      required: true
    },
    league: {
      type: String,
      enum: League,
      required: true
    },
    forfeit: {
      type: Number,
      enum: Forfeit,
      required: false
    },
    teamOneScore: { type: Number, required: false },
    teamTwoScore: { type: Number, required: false },
    teamOneEmailRecipient: { type: String, required: false },
    teamTwoEmailRecipient: { type: String, required: false },
    teamOneEmailDate: { type: Date, required: false },
    teamTwoEmailDate: { type: Date, required: false },
    teamOneBuybackDate: { type: Date, required: false },
    teamTwoBuybackDate: { type: Date, required: false },
    completed: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
);

// Indexes for frequently queried fields
matchSchema.index({ date: 1 });
matchSchema.index({ division: 1, league: 1 });
matchSchema.index({ teamOneName: 1, teamTwoName: 1 });
matchSchema.index({ completed: 1 });

export const Match: Model<MatchType> =
  (mongoose.models.Match as Model<MatchType>) ||
  mongoose.model<MatchType>("Match", matchSchema);

export default Match;
