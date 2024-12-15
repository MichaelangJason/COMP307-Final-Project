import React from 'react';
import "../styles/CreateButton.scss";

interface Props {
  className: string;
  value: string;
  onSubmit: (event: React.FormEvent) => void;
}

const CreateButton: React.FC<Props> = ({ className, value, onSubmit }) => {
  return (
    <button className={`createInput ${className}`} onClick={onSubmit}>
      {value}
    </button>
  );
};

export default CreateButton;



