import { useState } from "react";
import PollOption from "./PollOption";

import "../styles/Poll.scss";

interface Props {
  pollContent: {
    date: string;
    times: [string, string, boolean, boolean][];
  }[];
}

const Poll = ({ pollContent }: Props) => {
  const [dateTimes, setDateTimes] = useState<
    {
      date: string;
      times: [string, string, boolean, boolean][];
    }[]
  >(pollContent);
  return (
    <div className="poll roundShadowBorder">
      {dateTimes.map((datetime) => (
        <>
          <h2>{datetime.date}</h2>
          {datetime.times.map((time, index) => (
            <PollOption
              start={time[0]}
              end={time[0]}
              id={`poll${datetime.date}${index}`}
              date={datetime.date}
              toChoose={time[2]}
              isRed={time[3]}
            />
          ))}
        </>
      ))}
    </div>
  );
};

export default Poll;
