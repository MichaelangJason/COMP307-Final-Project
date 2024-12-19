import PollOption from "./PollOption";

import { Poll as PollType } from "@shared/types/db/poll";
import "../styles/Poll.scss";

interface Props {
  pollContent: PollType["options"];
  toChoose?: boolean;
}

const Poll = ({ pollContent, toChoose = false }: Props) => {
  return (
    <div className="poll roundShadowBorder">
      {pollContent.map((datetime) => (
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
              isRed={false && !toChoose}
            />
          ))}
        </>
      ))}
    </div>
  );
};

export default Poll;
