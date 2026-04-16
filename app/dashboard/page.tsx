import { Division, League, MatchType } from "@/models/matchSchema";
import { MatchComponent } from "@/app/components/MatchComponent";


export default function Dashboard() {

  let matches : MatchType[] = [
    {
      teamOneName: "Team One",
      teamTwoName: "Team Two",
      sport: "Soccer",
      location: "IM Fields",
      date: new Date(),
      division: Division.MONDAY_6PM,
      league: League.MEN,
      completed: false,
    },
    {
      teamOneName: "Team Three",
      teamTwoName: "Team Four",
      sport: "Football",
      location: "IM Fields",
      date: new Date(),
      division: Division.WEDNESDAY_5PM,
      league: League.WOMEN,
      completed: false,
    },
    {
      teamOneName: "Team One",
      teamTwoName: "Team Two",
      sport: "Soccer",
      location: "IM Fields",
      date: new Date(),
      division: Division.MONDAY_6PM,
      league: League.MEN,
      completed: false,
    },
    {
      teamOneName: "Team Three",
      teamTwoName: "Team Four",
      sport: "Football",
      location: "IM Fields",
      date: new Date(),
      division: Division.WEDNESDAY_5PM,
      league: League.WOMEN,
      completed: false,
    }
  ]

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">PASP Project</h1>
      <h2 className="text-lg">Upcoming Matches</h2>
      <div className="flex flex-row gap-4 w-full p-4 rounded-lg bg-gray-200 overflow-scroll flex-nowrap">
        {matches.map((match,index) => (
          <MatchComponent key={index} match={match}/>
        ))}
      </div>
      <h2 className="text-lg mt-4">Needs Action</h2>
      <div className="flex flex-row gap-4 w-full p-4 bg-gray-200 rounded-lg overflow-scroll flex-nowrap">
        {matches.map((match,index) => (
          <MatchComponent key={index} match={match}/>
        ))}
      </div>
      <h2 className="text-lg mt-4">Completed</h2>
      <div className="flex flex-row gap-4 w-full p-4 bg-gray-200 rounded-lg overflow-scroll flex-nowrap">
        {matches.map((match,index) => (
          <MatchComponent key={index} match={match}/>
        ))}
      </div>
    </div>
  );
}
