import "./Badge.scss";

type BadgeProps = {
  children: React.ReactNode;
};

const Badge = ({ children }: BadgeProps) => {
  return (
    <span className="badge">
      {children}
    </span>
  );
};

export default Badge;