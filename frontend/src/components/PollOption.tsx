import "../styles/PollOption.scss";

interface Props {
  start: string;
  end: string;
  date: string;
  toChoose?: boolean;
  isRed?: boolean;
}

const PollOption = ({
  start,
  end,
  date,
  toChoose = false,
  isRed = false,
}: Props) => {
  return (
    <div className={isRed ? "pollOption red" : "pollOption"}>
      <div>
        {start} - {end}
      </div>
      {toChoose && <input type="radio" value={`${start} - ${end}`} name={date} />}
    </div>
  );
};

export default PollOption;
