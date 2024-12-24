import { useEffect, useRef, useState } from 'react'
import './App.scss'
import { ContactWithId } from 'schema';
import { z } from 'zod';
import Panel from './components/Panel/Panel';
import BackButton from './components/BackButton/BackButton';
import ContactCategory from './components/ContactCategory/ContactCategory';
import Contact from './components/Contact/Contact';

type ContactType = z.infer<typeof ContactWithId>;

function App() {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    getContacts();
  },[]);

  const getContacts = async () => {
    const response = await fetch('http://localhost:3000/contacts/');
    const data = await response.json();
    const result = ContactWithId.array().safeParse(data.data);
    if (!result.success) {
      throw new Error(`Invalid person data: ${result.error}`);
    }
    setContacts(result.data);
  }

  return (
    <main>
      <nav className="sidebar" data-show={showSidebar}>
        <Panel>
          <ul>
            <ContactCategory
              onClick={() => setShowSidebar(!showSidebar)}
              badgeText="2"
              active={true}
              category="all"
            >
              All
            </ContactCategory>
          </ul>
        </Panel>
      </nav>
      
      <div className="content" data-show={!showSidebar}>
        <Panel>
          <div className="content__header">
            <BackButton onClick={() => setShowSidebar(!showSidebar)}>Categories</BackButton>
          </div>
          <ul>
            { contacts?.map(contact => (
              <Contact active={contact.id === 1} contact={contact} key={contact.id} />
            )) }
          </ul>
        </Panel>
      </div>
    </main>
  )
}

export default App
