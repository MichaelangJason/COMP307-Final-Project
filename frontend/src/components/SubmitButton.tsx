import "../styles/SubmitButton.scss";

interface Props {
  className?: string;
  value: string;
}

const SubmitButton = ({ className = "", value }: Props) => {
  return (
    <div className={className}>
      <input
        className="submitInput"
        type="submit"
        name="submit"
        value={value}
      />
    </div>
  );
};

export default SubmitButton;
