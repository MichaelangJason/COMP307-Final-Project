import "../styles/SubmitButton.scss";

interface Props {
  className?: string;
  value: string;
  onClick?: () => void;
}

const SubmitButton = ({ className = "", value, onClick = () => {} }: Props) => {
  return (
    <div className={className}>
      <input
        className="submitInput"
        type="submit"
        name="submit"
        value={value}
        onClick={onClick}
      />
    </div>
  );
};

export default SubmitButton;
