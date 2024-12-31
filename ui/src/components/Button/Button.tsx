import "./Button.scss";

interface ButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  rounded?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({
  children,
  icon,
  rounded = false,
  label,
  variant = "primary",
  fullWidth = false,
  iconOnly = false,
  disabled = false,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`button button--${variant} ${rounded ? "button--rounded" : ""} ${fullWidth ? "button--full-width" : ""} ${iconOnly ? "button--icon-only" : ""}`}
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {icon || null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
