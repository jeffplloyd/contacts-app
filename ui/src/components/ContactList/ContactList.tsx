import { useLocation, useNavigate } from "react-router-dom";
import { ContactType } from "../../services/contacts";
import "./ContactList.scss";
import Contact from "../Contact/Contact";

interface ContactListProps {
  contacts: ContactType[];
  onFavorite?: (id: number) => void;
}

const ContactList = ({ contacts }: ContactListProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const groupedContacts = (contacts: ContactType[]) => {
    const grouped = contacts.reduce((acc: { [key: string]: ContactType[] }, contact) => {
      const firstLetter = contact.fname[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(contact);
      return acc;
    }, {});
    return grouped;
  };

  return (
    <ul className="contact-list">
      {Object.keys(groupedContacts(contacts)).map((letter) => (
        <li key={letter}>
          <h2>{letter}</h2>
          <ul>
            {groupedContacts(contacts)[letter].map((contact) => (
              <Contact
                active={pathname === `/contact/${contact.id}`}
                contact={contact}
                key={contact.id}
                onClick={() => navigate(`/contact/${contact.id}`, { state: null })}
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default ContactList;
