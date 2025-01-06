import { useEffect, useRef, useState } from "react";
import "./App.scss";
import Panel from "./components/Panel/Panel";
import BackButton from "./components/BackButton/BackButton";
import Contact from "./components/Contact/Contact";
import Button from "./components/Button/Button";
import FormField from "./components/FormField/FormField";
import ContactNavigation from "./components/ContactNavigation/ContactNavigation";
import { ContactType, getContactRoles, getContacts, updateFavorite } from "./services/contacts";
import AppRouter from "./components/AppRouter";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "./hooks/useToast";
import { useDrawer } from "./hooks/useDrawer";
import ContactForm, { ContactFormRef } from "./components/Forms/ContactForm";

function App() {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const hasFetched = useRef(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const drawer = useDrawer();
  const contactFormRef = useRef<ContactFormRef>(null);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    fetchContacts();
  }, []);

  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    if (searchQuery === "") {
      if (activeCategory === "all") {
        setFilteredContacts(contacts);
        return;
      }
      if (activeCategory === "favorites") {
        setFilteredContacts(contacts.filter((contact) => contact.is_favorite));
        return;
      }
      if (activeCategory) {
        setFilteredContacts(getContactRoles(contacts)[activeCategory].contacts);
        return;
      }
      return;
    }
    const filtered = contacts.filter((contact) => {
      const queryLower = searchQuery.toLowerCase();
      const fnameMatch = contact.fname.toLowerCase().startsWith(queryLower);
      const lnameMatch = contact.lname.toLowerCase().startsWith(queryLower);
      const combinedMatch = `${contact.fname.toLowerCase()} ${contact.lname.toLowerCase()}`.startsWith(queryLower);
      if (activeCategory === "all") {
        return fnameMatch || lnameMatch || combinedMatch;
      } else if (activeCategory === "favorites") {
        return (fnameMatch || lnameMatch || combinedMatch) && contact.is_favorite;
      } else {
        return (fnameMatch || lnameMatch || combinedMatch) && contact.role === activeCategory;
      }
    });
    setFilteredContacts(filtered);
  }, [searchQuery, contacts, activeCategory]);

  const fetchContacts = async () => {
    try {
      const contacts = await getContacts();
      setContacts(contacts);
    } catch (error) {
      if (error instanceof Error && error.message === "Failed to fetch") {
        toast.error("Failed to fetch contacts", null, {
          text: "Retry",
          onClick: (id?: string) => {
            fetchContacts();
            if (id) toast.removeToast(id);
          },
        });
        return;
      }
    }
  };

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

  const addContact = () => {
    drawer.setConfig({
      headerText: "Add a Contact",
      position: "left",
      actions: (
        <>
          <Button
            variant="tertiary"
            onClick={() => drawer.setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => contactFormRef.current?.submit()}
          >
            Save
          </Button>
        </>
      ),
      children: <ContactForm ref={contactFormRef} />,
    });
    drawer.setIsOpen(true);
  };

  const handleNewContactClick = () => {
    addContact();
    if (showSidebar) {
      setShowSidebar(false);
    }
  };

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
  };

  const handleFavorite = async (id: number) => {
    await updateFavorite(id);
    fetchContacts();
  };

  const sortContacts = (contacts: ContactType[]) => {
    const sorted = [...contacts].sort((a, b) => {
      const aName = `${a.fname} ${a.lname}`;
      const bName = `${b.fname} ${b.lname}`;
      if (aName < bName) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aName > bName) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  };

  return (
    <main>
      <div
        className="sidebar"
        data-show={showSidebar}
      >
        <Panel>
          <div className="split-layout">
            <ContactNavigation
              contacts={contacts}
              activeCategory={activeCategory}
              handleCategoryClick={handleCategoryClick}
            />
            <Button
              variant="primary"
              icon={
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 1.5C6.09375 1.5 5.28125 2 4.8125 2.75C4.375 3.53125 4.375 4.5 4.8125 5.25C5.28125 6.03125 6.09375 6.5 7 6.5C7.875 6.5 8.6875 6.03125 9.15625 5.25C9.59375 4.5 9.59375 3.53125 9.15625 2.75C8.6875 2 7.875 1.5 7 1.5ZM7 8C5.5625 8 4.25 7.25 3.53125 6C2.8125 4.78125 2.8125 3.25 3.53125 2C4.25 0.78125 5.5625 0 7 0C8.40625 0 9.71875 0.78125 10.4375 2C11.1562 3.25 11.1562 4.78125 10.4375 6C9.71875 7.25 8.40625 8 7 8ZM5.5625 11C3.5 11 1.8125 12.5312 1.53125 14.5H12.4375C12.1562 12.5312 10.4688 11 8.40625 11H5.5625ZM5.5625 9.5H8.40625C11.5 9.5 14 12 14 15.0938C14 15.5938 13.5625 16 13.0625 16H0.90625C0.40625 16 0 15.5938 0 15.0938C0 12 2.46875 9.5 5.5625 9.5ZM15.75 9.75V7.75H13.75C13.3125 7.75 13 7.4375 13 7C13 6.59375 13.3125 6.25 13.75 6.25H15.75V4.25C15.75 3.84375 16.0625 3.5 16.5 3.5C16.9062 3.5 17.25 3.84375 17.25 4.25V6.25H19.25C19.6562 6.25 20 6.59375 20 7C20 7.4375 19.6562 7.75 19.25 7.75H17.25V9.75C17.25 10.1875 16.9062 10.5 16.5 10.5C16.0625 10.5 15.75 10.1875 15.75 9.75Z"
                    fill="currentColor"
                  />
                </svg>
              }
              onClick={handleNewContactClick}
            >
              New Contact
            </Button>
          </div>
        </Panel>
      </div>

      <div
        className="content"
        data-show={!showSidebar && pathname === "/"}
      >
        <Panel overflowHidden={true}>
          <div className="content__header">
            <div className="mobile-only">
              <BackButton onClick={() => setShowSidebar(!showSidebar)}>Categories</BackButton>
              <button
                className="content__header__action"
                type="button"
                aria-label="New Contact"
                onClick={handleNewContactClick}
              >
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 1.5C6.09375 1.5 5.28125 2 4.8125 2.75C4.375 3.53125 4.375 4.5 4.8125 5.25C5.28125 6.03125 6.09375 6.5 7 6.5C7.875 6.5 8.6875 6.03125 9.15625 5.25C9.59375 4.5 9.59375 3.53125 9.15625 2.75C8.6875 2 7.875 1.5 7 1.5ZM7 8C5.5625 8 4.25 7.25 3.53125 6C2.8125 4.78125 2.8125 3.25 3.53125 2C4.25 0.78125 5.5625 0 7 0C8.40625 0 9.71875 0.78125 10.4375 2C11.1562 3.25 11.1562 4.78125 10.4375 6C9.71875 7.25 8.40625 8 7 8ZM5.5625 11C3.5 11 1.8125 12.5312 1.53125 14.5H12.4375C12.1562 12.5312 10.4688 11 8.40625 11H5.5625ZM5.5625 9.5H8.40625C11.5 9.5 14 12 14 15.0938C14 15.5938 13.5625 16 13.0625 16H0.90625C0.40625 16 0 15.5938 0 15.0938C0 12 2.46875 9.5 5.5625 9.5ZM15.75 9.75V7.75H13.75C13.3125 7.75 13 7.4375 13 7C13 6.59375 13.3125 6.25 13.75 6.25H15.75V4.25C15.75 3.84375 16.0625 3.5 16.5 3.5C16.9062 3.5 17.25 3.84375 17.25 4.25V6.25H19.25C19.6562 6.25 20 6.59375 20 7C20 7.4375 19.6562 7.75 19.25 7.75H17.25V9.75C17.25 10.1875 16.9062 10.5 16.5 10.5C16.0625 10.5 15.75 10.1875 15.75 9.75Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className="content__header__search">
              <FormField
                compact
                label="Search"
                type="search"
                name="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search"
              />
            </div>
            <Button
              variant="secondary"
              rounded={true}
              icon={
                <>
                  {sortDirection === "asc" ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 1C12.2812 1 12.5312 1.1875 12.6562 1.4375L15.1562 6.4375C15.3438 6.8125 15.1875 7.25 14.8125 7.4375C14.4688 7.625 14 7.46875 13.8125 7.09375L13.4062 6.25C13.3438 6.25 13.2812 6.28125 13.25 6.28125H10.5625L10.1562 7.09375C9.96875 7.46875 9.53125 7.625 9.15625 7.4375C8.78125 7.25 8.625 6.8125 8.8125 6.4375L11.3125 1.4375C11.4375 1.1875 11.6875 1 12 1ZM11.3125 4.75H12.6562L12 3.4375L11.3125 4.75ZM3.46875 1.21875C3.75 0.9375 4.21875 0.9375 4.5 1.21875L7.5 4.21875C7.8125 4.53125 7.8125 5 7.5 5.28125C7.21875 5.59375 6.75 5.59375 6.46875 5.28125L4.75 3.5625V14.25C4.75 14.6875 4.40625 15 4 15C3.5625 15 3.25 14.6875 3.25 14.25V3.5625L1.53125 5.28125C1.21875 5.59375 0.75 5.59375 0.46875 5.28125C0.15625 5 0.15625 4.53125 0.46875 4.25L3.46875 1.25V1.21875ZM10 9H14C14.2812 9 14.5625 9.1875 14.6562 9.46875C14.7812 9.71875 14.75 10.0312 14.5312 10.25L11.6562 13.5H14C14.4062 13.5 14.75 13.8438 14.75 14.25C14.75 14.6875 14.4062 15 14 15H10C9.6875 15 9.4375 14.8438 9.3125 14.5625C9.1875 14.3125 9.21875 14 9.4375 13.75L12.3125 10.5H10C9.5625 10.5 9.25 10.1875 9.25 9.75C9.25 9.34375 9.5625 9 10 9Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.46875 11.7812C0.15625 11.5 0.15625 11.0312 0.46875 10.7188C0.75 10.4375 1.21875 10.4375 1.53125 10.7188L3.25 12.4688V1.75C3.25 1.34375 3.5625 1 4 1C4.40625 1 4.75 1.34375 4.75 1.75V12.4688L6.46875 10.75C6.75 10.4375 7.21875 10.4375 7.5 10.75C7.8125 11.0312 7.8125 11.5 7.5 11.7812L4.5 14.7812C4.21875 15.0938 3.75 15.0938 3.46875 14.7812L0.46875 11.7812ZM10 1H14C14.2812 1 14.5625 1.1875 14.6562 1.46875C14.7812 1.71875 14.75 2.03125 14.5312 2.25L11.6562 5.5H14C14.4062 5.5 14.75 5.84375 14.75 6.25C14.75 6.6875 14.4062 7 14 7H10C9.6875 7 9.40625 6.84375 9.3125 6.5625C9.1875 6.3125 9.21875 6 9.4375 5.78125L12.3125 2.5H10C9.5625 2.5 9.25 2.1875 9.25 1.75C9.25 1.34375 9.5625 1 10 1ZM12 8.5H11.9688C12.2812 8.5 12.5312 8.6875 12.6562 8.9375L15.1562 13.9375C15.3438 14.3125 15.1875 14.75 14.8125 14.9375C14.4375 15.125 14 14.9688 13.8125 14.5938L13.375 13.75C13.3438 13.75 13.2812 13.75 13.25 13.75H10.5625L10.1562 14.5938C9.96875 14.9688 9.53125 15.125 9.15625 14.9375C8.78125 14.75 8.625 14.3125 8.8125 13.9375L11.3125 8.9375C11.4375 8.6875 11.6875 8.5 12 8.5ZM11.3125 12.25H12.6562L12 10.9375L11.3125 12.25Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </>
              }
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            />
          </div>
          {filteredContacts.length > 0 ? (
            <ul className="contact-list">
              {Object.keys(groupedContacts(sortContacts(filteredContacts))).map((letter) => (
                <li key={letter}>
                  <h2>{letter}</h2>
                  <ul>
                    {groupedContacts(sortContacts(filteredContacts))[letter].map((contact) => (
                      <Contact
                        active={pathname === `/contact/${contact.id}`}
                        contact={contact}
                        key={contact.id}
                        onClick={() => navigate(`/contact/${contact.id}`)}
                        onFavorite={handleFavorite}
                      />
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : null}
          {filteredContacts.length === 0 ? (
            <div className="no-results">
              <svg
                width="55"
                height="55"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.25 9.75C17.25 7.07812 15.7969 4.64062 13.5 3.28125C11.1562 1.92188 8.29688 1.92188 6 3.28125C3.65625 4.64062 2.25 7.07812 2.25 9.75C2.25 12.4688 3.65625 14.9062 6 16.2656C8.29688 17.625 11.1562 17.625 13.5 16.2656C15.7969 14.9062 17.25 12.4688 17.25 9.75ZM15.7969 17.4375C14.1094 18.75 12 19.5 9.75 19.5C4.35938 19.5 0 15.1406 0 9.75C0 4.40625 4.35938 0 9.75 0C15.0938 0 19.5 4.40625 19.5 9.75C19.5 12.0469 18.7031 14.1562 17.3906 15.8438L23.6719 22.0781C24.0938 22.5469 24.0938 23.25 23.6719 23.6719C23.2031 24.1406 22.5 24.1406 22.0781 23.6719L15.7969 17.4375Z"
                  fill="currentColor"
                />
              </svg>

              <h2>No results found</h2>
              <p>Check the spelling or try a differnt name.</p>
            </div>
          ) : null}
        </Panel>
      </div>

      <div
        className="contact-details"
        data-show={pathname.includes("contact")}
      >
        <AppRouter />
      </div>
    </main>
  );
}

export default App;
