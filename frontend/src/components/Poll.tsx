import { useState } from "react";
import PollOption from "./PollOption";

import "../styles/Poll.scss";

const Poll = () => {
  const [dateTimes, setDateTimes] = useState<
    {
      date: string;
      times: [string, string, boolean][];
    }[]
  >([
    {
      date: "February 3, 2024 (Monday)",
      times: [
        ["12:00", "12:30", true],
        ["12:00", "12:30", false],
      ],
    },
    {
      date: "February 6, 2024 (Tuesday)",
      times: [
        ["12:00", "12:30", true],
        ["12:00", "12:30", false],
        ["12:00", "12:30", false],
        ["12:00", "12:30", false],
        ["12:00", "12:30", false],
      ],
    },
    {
      date: "February 8, 2024 (Thursday)",
      times: [["12:00", "12:30", false]],
    },
  ]);
  return (
    <div className="poll roundShadowBorder">
      {dateTimes.map((datetime) => (
        <>
          <h2>{datetime.date}</h2>
          {datetime.times.map((time) => (
            <PollOption
              start={time[0]}
              end={time[0]}
              date={datetime.date}
              isRed={time[2]}
            />
          ))}
        </>
      ))}
    </div>
  );
};

export default Poll;
