import React from 'react';
import "../styles/CreateSt.scss";
import "../styles/CreateButton.scss"
import { CSSProperties } from 'react';

interface Props {
  className: string;
  value: string;
  onSubmit: (event: React.FormEvent) => void;
  style?: CSSProperties;
}

const CreateButton: React.FC<Props> = ({ className, value, onSubmit }) => {
  return (
    <button className={`createInput ${className}`} onClick={onSubmit}>
      {value}
    </button>
  );
};

export default CreateButton;



