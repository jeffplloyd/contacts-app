import Badge from "../Badge/Badge";
import "./ContactCategory.scss";

type ContactCategoryProps = {
  active?: boolean;
  children: React.ReactNode;
  category?: string;
  badgeText?: string;
  onClick?: (category: string) => void;
};

const ContactCategory = ({ active, category, children, badgeText, onClick }: ContactCategoryProps) => {
  const handleClick = () => {
    if (onClick && category) onClick(category);
  };

  return (
    <li className="contact-category">
      <button
        type="button"
        onClick={handleClick}
        data-active={active}
      >
        {children}
        {badgeText ? <Badge>{badgeText}</Badge> : null}
      </button>
    </li>
  );
};

export default ContactCategory;
