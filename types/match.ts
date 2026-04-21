export enum Division {
  MONDAY_6PM = 'Mondays 6PM',
  WEDNESDAY_5PM = 'Wednesdays 5PM',
}

export enum League {
  MEN = "Men's",
  WOMEN = "Women's",
  COED = 'Coed',
}

export enum Forfeit {
  NONE = 0,
  TEAMONE = 1,
  TEAMTWO = 2,
  BOTH = 3,
}

export type MatchType = {
  teamOneName : string,
  teamTwoName: string,
  sport: string,
  location: string,
  date: Date,
  division: Division,
  league: League,
  forfeit?: Forfeit,
  teamOneScore?: number,
  teamTwoScore?: number,
  teamOneEmailRecipient?: string,
  teamTwoEmailRecipient?: string,
  teamOneEmailDate?: Date,
  teamTwoEmailDate?: Date,
  teamOneBuybackDate?: Date,
  teamTwoBuybackDate?: Date,
  completed: boolean
};