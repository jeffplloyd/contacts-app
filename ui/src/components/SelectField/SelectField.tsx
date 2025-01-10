import { useState } from "react";
import "../FormField/FormField.scss";
import "./SelectField.scss";

interface SelectFieldProps {
  label: string;
  compact?: boolean;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  name: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
}

const SelectField = ({
  label,
  compact = false,
  value,
  onChange,
  options,
  name,
  placeholder,
  invalid,
  disabled,
  helperText,
}: SelectFieldProps) => {
  const [selectValue, setSelectValue] = useState(value);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(event.target.value);
    onChange?.(event);
  };

  return (
    <div className={`form-field ${invalid ? "form-field--invalid" : ""}`}>
      {!compact ? <label htmlFor={name}>{label}</label> : null}
      <div className="form-field__input">
        <select
          name={name}
          id={name}
          value={selectValue}
          onChange={handleSelectChange}
          aria-label={compact ? label : undefined}
          aria-describedby={helperText ? `${name}Helper` : undefined}
          className={`${invalid ? "form-field__input--invalid" : ""} ${value === "" ? "form-field__input--empty" : ""}`}
          disabled={disabled}
        >
          {placeholder ? (
            <option
              value=""
              disabled
            >
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span
          className="form-field__arrow"
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.53125 10.5312C8.21875 10.8438 7.75 10.8438 7.46875 10.5312L2.46875 5.53125C2.15625 5.25 2.15625 4.78125 2.46875 4.5C2.75 4.1875 3.21875 4.1875 3.5 4.5L7.96875 8.96875L12.4688 4.46875C12.75 4.1875 13.2188 4.1875 13.5 4.46875C13.8125 4.78125 13.8125 5.25 13.5 5.53125L8.53125 10.5312Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>

      {helperText ? (
        <div
          id={`${name}Helper`}
          className="form-field__helper"
        >
          {helperText}
        </div>
      ) : null}
    </div>
  );
};

export default SelectField;
