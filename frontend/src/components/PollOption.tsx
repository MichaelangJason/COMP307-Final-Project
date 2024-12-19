import { PollOption as PollOptionType } from "@shared/types/db/poll";
import "../styles/PollOption.scss";

interface Props {
  time: string;
  date: PollOptionType["date"];
  id: string;
  toChoose?: boolean;
  isRed?: boolean;
}

const PollOption = ({
  time,
  date,
  id,
  toChoose = false,
  isRed = false,
}: Props) => {
  return (
    <label
      className={
        isRed ? "pollOption red" : toChoose ? "pollOption choice" : "pollOption"
      }
      htmlFor={`poll${id}`}
    >
      {time}
      {toChoose && (
        <input type="radio" id={`poll${id}`} value={`${time}`} name={date} />
      )}
    </label>
  );
};

export default PollOption;
