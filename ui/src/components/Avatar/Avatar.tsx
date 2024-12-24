import "./Avatar.scss";

interface AvatarProps {
  initals: string;
  size?: "small" | "large";
}

const Avatar = ({ initals, size = "small" }: AvatarProps) => {
  return (
    <div className={`avatar avatar--${size}`}>
      <span>{initals}</span>
    </div>
  );
};

export default Avatar;