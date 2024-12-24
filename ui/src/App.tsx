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
          <ul className="contact-category-list">
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
        <Panel overflowHidden={true}>
          <div className="content__header">
            <BackButton onClick={() => setShowSidebar(!showSidebar)}>Categories</BackButton>
          </div>
          <ul className="contact-list">
            { contacts?.map(contact => (
              <Contact active={contact.id === 1} contact={contact} key={contact.id} />
            )) }

            <Contact contact={{
  "fname": "Jane",
  "lname": "Doe",
  "dob": "1990-01-01T00:00:00.000Z",
  "website": "https://example.com",
  "personal_email": "lY8jH@example.com",
  "personal_phone": "123-456-7890",
  "work_email": "lY8jH@example.com",
  "work_phone": "123-456-7890",
  "is_favorite": false,
  "role_id": null,
  "created_at": "2024-12-24T05:13:37.146Z",
  "updated_at": "2024-12-24T05:13:37.146Z",
  "id": 2
}}  />
<Contact contact={{
  "fname": "Jane",
  "lname": "Doe",
  "dob": "1990-01-01T00:00:00.000Z",
  "website": "https://example.com",
  "personal_email": "lY8jH@example.com",
  "personal_phone": "123-456-7890",
  "work_email": "lY8jH@example.com",
  "work_phone": "123-456-7890",
  "is_favorite": false,
  "role_id": null,
  "created_at": "2024-12-24T05:13:37.146Z",
  "updated_at": "2024-12-24T05:13:37.146Z",
  "id": 2
}}  />
<Contact contact={{
  "fname": "Jane",
  "lname": "Doe",
  "dob": "1990-01-01T00:00:00.000Z",
  "website": "https://example.com",
  "personal_email": "lY8jH@example.com",
  "personal_phone": "123-456-7890",
  "work_email": "lY8jH@example.com",
  "work_phone": "123-456-7890",
  "is_favorite": false,
  "role_id": null,
  "created_at": "2024-12-24T05:13:37.146Z",
  "updated_at": "2024-12-24T05:13:37.146Z",
  "id": 2
}}  />
<Contact contact={{
  "fname": "Jane",
  "lname": "Doe",
  "dob": "1990-01-01T00:00:00.000Z",
  "website": "https://example.com",
  "personal_email": "lY8jH@example.com",
  "personal_phone": "123-456-7890",
  "work_email": "lY8jH@example.com",
  "work_phone": "123-456-7890",
  "is_favorite": false,
  "role_id": null,
  "created_at": "2024-12-24T05:13:37.146Z",
  "updated_at": "2024-12-24T05:13:37.146Z",
  "id": 2
}}  />
          </ul>
        </Panel>
      </div>
    </main>
  )
}

export default App
