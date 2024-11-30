import "../styles/SubmitButton.scss";

interface Props {
  className?: string;
  value: string;
  onSubmit: () => void;
}

const SubmitButton = ({ className = "", value, onSubmit }: Props) => {
  return (
    <div className={className}>
      <input
        className="submitInput"
        type="submit"
        name="submit"
        value={value}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default SubmitButton;
