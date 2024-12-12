import "../styles/PollOption.scss";

interface Props {
  start: string;
  end: string;
  date: string;
  id: string;
  toChoose?: boolean;
  isRed?: boolean;
}

const PollOption = ({
  start,
  end,
  date,
  id,
  toChoose = false,
  isRed = false,
}: Props) => {
  return (
    <label
      className={isRed ? "pollOption red" : toChoose ? "pollOption choice" : "pollOption"}
      htmlFor={`poll${id}`}
    >
      {start} - {end}
      {toChoose && (
        <input
          type="radio"
          id={`poll${id}`}
          value={`${start} - ${end}`}
          name={date}
        />
      )}
    </label>
  );
};

export default PollOption;
