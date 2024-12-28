import { useState } from "react";
import "./FormField.scss";

interface FormFieldProps {
  label: string;
  compact?: boolean;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: "text" | "email" | "password" | "search";
  placeholder?: string;
  name: string;
  invalid?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
}

const FormField = ({
  label,
  compact = false,
  value,
  onChange,
  type,
  placeholder,
  name,
  invalid,
  disabled,
  helperText
}: FormFieldProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onChange?.(event);
  };
  
  return (
    <div className="form-field">
      { !compact ? <label htmlFor={name}>{label}</label> : null }
      <div className="form-field__input">
        <input
          aria-label={compact ? label : undefined}
          aria-describedby={helperText ? `${name}Helper` : undefined}
          type={type}
          name={name}
          id={name}
          value={inputValue}
          onInput={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={invalid ? "invalid" : ""}
        />

        { type === "search" ? (
          <div className="form-field__accessory">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 6.5C11.5 4.71875 10.5312 3.09375 9 2.1875C7.4375 1.28125 5.53125 1.28125 4 2.1875C2.4375 3.09375 1.5 4.71875 1.5 6.5C1.5 8.3125 2.4375 9.9375 4 10.8438C5.53125 11.75 7.4375 11.75 9 10.8438C10.5312 9.9375 11.5 8.3125 11.5 6.5ZM10.5312 11.625C9.40625 12.5 8 13 6.5 13C2.90625 13 0 10.0938 0 6.5C0 2.9375 2.90625 0 6.5 0C10.0625 0 13 2.9375 13 6.5C13 8.03125 12.4688 9.4375 11.5938 10.5625L15.7812 14.7188C16.0625 15.0312 16.0625 15.5 15.7812 15.7812C15.4688 16.0938 15 16.0938 14.7188 15.7812L10.5312 11.625Z" fill="currentColor"/>
            </svg>
          </div>
        ) : null }
      </div>
      
      { helperText ? (
        <div id={`${name}Helper`} className="form-field__helper">{helperText}</div>
      ) : null } 
    </div>
  );
};

export default FormField;