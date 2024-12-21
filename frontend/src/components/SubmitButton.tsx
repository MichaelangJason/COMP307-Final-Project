// Han Wen Fu

import "../styles/SubmitButton.scss";

interface Props {
  className?: string;
  value: string;
  onClick?: () => void;
  type?: string;
}

const SubmitButton = ({
  className = "",
  value,
  type = "submit",
  onClick = () => {},
}: Props) => {
  return (
    <div className={className}>
      <input
        className="submitInput"
        type={type}
        name="submit"
        value={value}
        onClick={onClick}
      />
    </div>
  );
};

export default SubmitButton;
