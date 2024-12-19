import PollOption from "./PollOption";

import { Poll as PollType } from "@shared/types/db/poll";
import "../styles/Poll.scss";

interface Props {
  pollContent: PollType["options"];
  toChoose?: boolean;
}

const Poll = ({pollContent, toChoose = false }: Props) => {
  const pollWinners = pollContent?.map((option) => {
    const [maxSlot] = Object.entries(option.slots).reduce(
      ([currentSlot, currentVotes], [slot, votes]) =>
        votes > currentVotes ? [slot, votes] : [currentSlot, currentVotes],
      ["", -Infinity]
    );

    return { date: option.date, winningSlot: maxSlot };
  });

  return (
    <div className="poll roundShadowBorder">
      {pollContent?.map((datetime) => (
        <>
          <h2>
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(datetime.date))}
          </h2>
          {Object.keys(datetime.slots).map((time, index) => (
            <PollOption
              time={time}
              id={`poll${datetime.date}${index}`}
              date={datetime.date}
              toChoose={toChoose}
              isRed={
                pollWinners.find((poll) => poll.date === datetime.date)
                  ?.winningSlot === time
              }
            />
          ))}
        </>
      ))}
    </div>
  );
};

export default Poll;
