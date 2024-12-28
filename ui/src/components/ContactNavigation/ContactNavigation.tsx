import { ContactType, getContactRoles } from "../../services/contacts";
import ContactCategory from "../ContactCategory/ContactCategory";
import "./ContactNavigation.scss";

interface ContactNavigationProps {
  contacts: ContactType[];
  activeCategory?: string;
  handleCategoryClick: (category: string) => void;
}

const ContactNavigation = ({ contacts, activeCategory, handleCategoryClick }: ContactNavigationProps) => {
  return (
    <nav className="contact-navigation">
      <ul className="contact-category-list">
        <ContactCategory
          onClick={() => handleCategoryClick("all")}
          badgeText={contacts.length.toString() || undefined}
          active={activeCategory === "all"}
          category="all"
        >
          All Contacts
        </ContactCategory>
        
        { contacts.filter((contact) => contact.is_favorite).length > 0 ? (
          <ContactCategory
            onClick={() => handleCategoryClick("favorites")}
            badgeText={contacts.filter((contact) => contact.is_favorite).length.toString()}
            active={activeCategory === "favorites"}
            category="favorites"
          >
            My Favorites
          </ContactCategory>
        ) : null }
        
        { Object.keys(getContactRoles(contacts)).map((role) => (
          <ContactCategory
            onClick={() => handleCategoryClick(role)}
            badgeText={getContactRoles(contacts)[role].count.toString()}
            active={activeCategory === role}
            category={role}
            key={role}
          >
            {role}
          </ContactCategory>
        )) }
      </ul>
    </nav>
  );
};

export default ContactNavigation;