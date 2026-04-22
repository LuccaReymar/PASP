export enum Division {
  MONDAY_6PM = 'Mondays 6PM',
  MONDAY_9PM = 'Mondays 9PM',
  MONDAY_10_1030PM = 'Mondays 10PM & 10:30PM',
  WEDNESDAY_5PM = 'Wednesdays 5PM',
  WEDNESDAY_6PM = 'Wednesdays 6PM',
  WEDNESDAY_8PM = 'Wednesdays 8PM',
  WEDNESDAY_9PM = 'Wednesdays 9PM',
  THURSDAY_9PM = 'Thursdays 9PM',
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