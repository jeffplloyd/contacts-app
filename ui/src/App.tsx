import { useEffect, useRef, useState } from 'react'
import './App.scss'
import { ListContact } from 'schema';
import { z } from 'zod';
import Panel from './components/Panel/Panel';
import BackButton from './components/BackButton/BackButton';
import ContactCategory from './components/ContactCategory/ContactCategory';
import Contact from './components/Contact/Contact';

type ContactType = z.infer<typeof ListContact>;

function App() {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>("all");
  const [contactIsActive, setContactIsActive] = useState<number | null>();
  const hasFetched = useRef(false);
  
  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    getContacts();
  },[]);

  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  const getContacts = async () => {
    const response = await fetch('http://localhost:3000/contacts/list');
    const data = await response.json();
    const result = ListContact.array().safeParse(data.data);
    if (!result.success) {
      throw new Error(`Invalid person data: ${result.error}`);
    }
    setContacts(result.data);
  }

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
  }

  const getContactRoles = (contacts: ContactType[]) => {
    const grouped = contacts.reduce((acc: { [key: string]: { contacts: ContactType[], count: number } }, contact) => {
      const role = contact.role || 'Unknown';
      if (!acc[role]) {
        acc[role] = { contacts: [], count: 0 };
      }
      acc[role].contacts.push(contact);
      acc[role].count++;
      return acc;
    }, {});
    return grouped;
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredContacts(contacts);
    } else if (category === "favorites") {
      setFilteredContacts(contacts.filter((contact) => contact.is_favorite));
    } else {
      setFilteredContacts(getContactRoles(contacts)[category].contacts);
    }
    setShowSidebar(!showSidebar);
  }

  return (
    <main>
      <nav className="sidebar" data-show={showSidebar}>
        <Panel>
          <ul className="contact-category-list">
              <ContactCategory
                onClick={() => handleCategoryClick("all")}
                badgeText={contacts.length.toString()}
                active={activeCategory === "all"}
                category="all"
              >
                All Contacts
              </ContactCategory>
              <ContactCategory
                onClick={() => handleCategoryClick("favorites")}
                badgeText={contacts.filter((contact) => contact.is_favorite).length.toString()}
                active={activeCategory === "favorites"}
                category="favorites"
              >
                My Favorites
              </ContactCategory>
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
        </Panel>
      </nav>
      
      <div className="content" data-show={!showSidebar}>
        <Panel overflowHidden={true}>
          <div className="content__header">
            <BackButton 
              onClick={() => setShowSidebar(!showSidebar)}
            >
              Categories
            </BackButton>
          </div>
          <ul className="contact-list">
            { Object.keys(groupedContacts(filteredContacts)).map((letter) => (
              <li key={letter}>
                <h2>{letter}</h2>
                <ul>
                  { groupedContacts(filteredContacts)[letter].map((contact) => (
                    <Contact 
                      active={contactIsActive === contact.id}
                      contact={contact}
                      key={contact.id}
                      onClick={() => setContactIsActive(contact.id)}
                    />
                  )) }
                </ul>
              </li>
            )) }
          </ul>
        </Panel>
      </div>
    </main>
  )
}

export default App
