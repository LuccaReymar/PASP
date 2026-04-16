import mongoose, { Schema, Model } from "mongoose";

export enum Division {
  MONDAY_6PM = 'Mondays 6PM',
  WEDNESDAY_5PM = 'Wednesdays 5PM',
}

export enum League {
  MEN = "Men's",
  WOMEN = "Women's",
  COED = 'Coed',
}

export enum Forfiet {
  NONE,
  TEAMONE,
  TEAMTWO,
  BOTH,
}

export type MatchType = {
  teamOneName : string,
  teamTwoName: string,
  sport: string,
  location: string,
  date: Date,
  division: Division,
  league: League,
  forfiet?: Forfiet,
  teamOneScore?: number,
  teamTwoScore?: number,
  teamOneEmailRecepient?: string,
  teamTwoEmailRecepient?: string,
  teamOneEmailDate?: Date,
  teamTwoEmailDate?: Date,
  teamOneBuybackDate?: Date,
  teamTwoBackBack?: boolean,
  completed: boolean
};

export type MatchDoc = mongoose.HydratedDocument<MatchType>;

const matchSchema = new Schema<MatchType>(
  {
    teamOneName: { type: String, required: true },
    teamTwoName: { type: String, required: true },
    sport: { type: String, required: true },
    location: { type: String, required: true },
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
    forfiet: {
      type: Number,
      enum: Forfiet,
      required: false
    },
    teamOneScore: { type: Number, required: false },
    teamTwoScore: { type: Number, required: false },
    teamOneEmailRecepient: { type: String, required: false },
    teamTwoEmailRecepient: { type: String, required: false },
    teamOneEmailDate: { type: Date, required: false },
    teamTwoEmailDate: { type: Date, required: false },
    teamOneBuybackDate: { type: Date, required: false },
    teamTwoBackBack: { type: Boolean, required: false },
    completed: { type: Boolean, required: true }
  },
  { timestamps: true }
);

export const Match: Model<MatchType> =
  (mongoose.models.Match as Model<MatchType>) ||
  mongoose.model<MatchType>("Match", matchSchema);

export default Match;
