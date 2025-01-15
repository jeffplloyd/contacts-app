import { useNavigate, useParams } from "react-router-dom";
import Panel from "../../components/Panel/Panel";
import "./ContactDetails.scss";
import Card from "../../components/Card/Card";
import Avatar from "../../components/Avatar/Avatar";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import { useEffect, useRef, useState } from "react";
import { ContactDetailsType, createContact, deleteContact, getContact } from "../../services/contacts";
import { useDrawer } from "../../hooks/useDrawer";
import { useToast } from "../../hooks/useToast";
import ContactForm, { ContactFormRef } from "../../components/Forms/ContactForm";
import useViewportSize from "../../hooks/useViewportSize";

interface ContactDetailsProps {
  onContactDeleted?: () => void;
  onFavorite?: (id: number) => void;
  onContactUpdated?: () => void;
}

const ContactDetails = ({ onContactDeleted, onFavorite }: ContactDetailsProps) => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contactData, setContactData] = useState<ContactDetailsType | null>(null);
  const drawer = useDrawer();
  const toast = useToast();
  const contactFormRef = useRef<ContactFormRef>(null);
  const screenSize = useViewportSize();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!contactId) {
      return;
    }
    fetchContact(Number(contactId));
  }, [contactId]);

  const fetchContact = async (contactId: number) => {
    try {
      const contact = await getContact(contactId);
      setContactData(contact);
      setIsFavorite(contact.is_favorite || false);
    } catch (error) {
      if (error instanceof Error && error.message === "Failed to fetch") {
        toast.error("Failed to fetch contacts", null, {
          text: "Retry",
          onClick: (id?: string) => {
            fetchContact(Number(contactId));
            if (id) toast.removeToast(id);
          },
        });
        return;
      }
    }
  };

  const handleDeleteContact = async () => {
    if (!contactData?.id) return;

    try {
      const deletedContact = await deleteContact(contactData.id);
      if (onContactDeleted) onContactDeleted();
      if (deletedContact) {
        toast.info("Contact deleted", 5000, {
          text: "UNDO",
          onClick: () => handleUndoDelete(deletedContact),
        });
        drawer.setIsOpen(false);
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to delete contact", null, {
          text: "Retry",
          onClick: (id?: string) => {
            handleDeleteContact();
            if (id) toast.removeToast(id);
          },
        });
        return;
      }
    }
  };

  const handleEditContact = () => {
    drawer.setIsOpen(true);
    drawer.setConfig({
      headerText: screenSize === "sm" ? undefined : "Edit Contact",
      actions: (
        <div className="edit-contact-actions">
          <Button
            variant="distructive"
            onClick={handleDeleteContact}
          >
            Delete
          </Button>
          <div className="edit-contact-actions__right">
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
          </div>
        </div>
      ),
      children: (
        <ContactForm
          ref={contactFormRef}
          contact={contactData}
        />
      ),
    });
  };

  const handleFavorite = () => {
    if (!contactData?.id) return;
    if (onFavorite) {
      onFavorite(Number(contactData.id));
      toast.info(isFavorite ? "Removed from favorites" : "Added to favorites", 5000, { text: "Dismiss" });
      setIsFavorite(!isFavorite);
    }
  };

  const handleUndoDelete = async (deletedContact: ContactDetailsType) => {
    const newData: ContactDetailsType = {
      ...deletedContact,
      created_at: deletedContact.created_at ? new Date(deletedContact.created_at) : new Date(),
      updated_at: deletedContact.updated_at ? new Date(deletedContact.updated_at) : new Date(),
    };
    delete newData.id;
    try {
      const contact = await createContact(newData);
      if (onContactDeleted) onContactDeleted();
      if (contact) {
        setTimeout(() => {
          toast.info("Contact restored", 5000, {
            text: "Dismiss",
          });
        }, 200);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to restore contact", null, {
          text: "Dismiss",
        });
        return;
      }
    }
  };

  return (
    <Panel overflowHidden={true}>
      {screenSize && ["sm", "md"].includes(screenSize) ? (
        <div className="contact-details__heading">
          <Button
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.21875 8.5625C1.0625 8.40625 1 8.21875 1 8C1 7.8125 1.0625 7.625 1.21875 7.46875L6.71875 2.21875C7.03125 1.9375 7.5 1.9375 7.78125 2.25C8.0625 2.53125 8.0625 3.03125 7.75 3.3125L3.59375 7.25H14.25C14.6562 7.25 15 7.59375 15 8C15 8.4375 14.6562 8.75 14.25 8.75H3.59375L7.75 12.7188C8.0625 13 8.0625 13.4688 7.78125 13.7812C7.5 14.0938 7.03125 14.0938 6.71875 13.8125L1.21875 8.5625Z"
                  fill="currentColor"
                />
              </svg>
            }
            variant="tertiary"
            onClick={() => navigate("/")}
          >
            All Contacts
          </Button>
          {screenSize === "sm" ? (
            <Button
              label="Edit Contact"
              variant="tertiary"
              onClick={() => handleEditContact()}
              iconOnly={true}
              rounded={true}
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.125 12.2812C2.25 11.8438 2.5 11.4375 2.8125 11.125L12.3125 1.625C13.0938 0.84375 14.375 0.84375 15.1562 1.625L16.375 2.84375C16.4688 2.9375 16.5625 3.0625 16.625 3.15625C17.1562 3.9375 17.0625 5 16.375 5.6875L6.875 15.1875C6.84375 15.2188 6.78125 15.25 6.75 15.3125C6.4375 15.5625 6.09375 15.75 5.71875 15.875L3.28125 16.5938L1.9375 17C1.6875 17.0625 1.40625 17 1.21875 16.7812C1 16.5938 0.9375 16.3125 1.03125 16.0625L1.40625 14.7188L2.125 12.2812ZM3.5625 12.7188L3.34375 13.4375L2.84375 15.1562L4.5625 14.6562L5.28125 14.4375C5.5 14.375 5.65625 14.2812 5.8125 14.125L12.9688 6.96875L11.0312 5.03125L3.875 12.1875C3.84375 12.1875 3.84375 12.2188 3.8125 12.25C3.6875 12.375 3.625 12.5312 3.5625 12.7188Z"
                    fill="currentColor"
                  />
                </svg>
              }
            />
          ) : null}
        </div>
      ) : null}
      <div className="contact-details__content">
        {contactData ? (
          <Card>
            <div className="contact-details__main-info">
              <div className="contact-details__contact-heading">
                <div className="contact-details__avatar">
                  <Avatar
                    size="large"
                    initals={`${contactData?.fname.charAt(0)}${contactData?.lname.charAt(0)}`}
                  />
                </div>
                <div className="contact-details__name">
                  <span>
                    {contactData?.fname} {contactData?.lname}
                  </span>
                  <div className="contact-details__role">
                    <Badge>{contactData?.role || "Other"}</Badge>
                  </div>
                </div>
              </div>
              {screenSize !== "sm" ? (
                <Button
                  label="Edit Contact"
                  variant="tertiary"
                  onClick={() => handleEditContact()}
                  iconOnly={true}
                  rounded={true}
                  icon={
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.125 12.2812C2.25 11.8438 2.5 11.4375 2.8125 11.125L12.3125 1.625C13.0938 0.84375 14.375 0.84375 15.1562 1.625L16.375 2.84375C16.4688 2.9375 16.5625 3.0625 16.625 3.15625C17.1562 3.9375 17.0625 5 16.375 5.6875L6.875 15.1875C6.84375 15.2188 6.78125 15.25 6.75 15.3125C6.4375 15.5625 6.09375 15.75 5.71875 15.875L3.28125 16.5938L1.9375 17C1.6875 17.0625 1.40625 17 1.21875 16.7812C1 16.5938 0.9375 16.3125 1.03125 16.0625L1.40625 14.7188L2.125 12.2812ZM3.5625 12.7188L3.34375 13.4375L2.84375 15.1562L4.5625 14.6562L5.28125 14.4375C5.5 14.375 5.65625 14.2812 5.8125 14.125L12.9688 6.96875L11.0312 5.03125L3.875 12.1875C3.84375 12.1875 3.84375 12.2188 3.8125 12.25C3.6875 12.375 3.625 12.5312 3.5625 12.7188Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />
              ) : null}
            </div>
            <div className="contact-details__actions">
              <Button
                label="Call"
                iconOnly={true}
                rounded={screenSize === "sm"}
                fullWidth={screenSize !== "sm"}
                disabled={!contactData?.personal_phone && !contactData?.work_phone}
                icon={
                  <svg
                    width="17"
                    height="18"
                    viewBox="0 0 17 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.7188 9.625L15.2188 11.125C15.7812 11.3438 16.0938 11.9375 15.9688 12.5312L15.2188 16.0312C15.0938 16.5938 14.5625 17.0312 14 17.0312C13.7812 17.0312 13.5938 17 13.4062 17C13.0938 17 12.7812 16.9688 12.5 16.9375C5.46875 16.1875 0 10.25 0 3C0 2.4375 0.40625 1.90625 0.96875 1.78125L4.46875 1.03125C5.0625 0.90625 5.65625 1.21875 5.875 1.78125L7.375 5.28125C7.59375 5.78125 7.46875 6.375 7.03125 6.71875L5.75 7.78125C6.59375 9.21875 7.78125 10.4062 9.21875 11.25L10.2812 9.96875C10.625 9.53125 11.2188 9.40625 11.7188 9.625ZM13.7812 15.5L14.4375 12.4062L11.3125 11.0625L10.4062 12.1875C9.9375 12.75 9.125 12.9062 8.46875 12.5312C6.8125 11.5625 5.4375 10.1875 4.46875 8.53125C4.09375 7.875 4.25 7.0625 4.8125 6.59375L5.9375 5.6875L4.59375 2.5625L1.5 3.21875C1.59375 9.96875 7.03125 15.4062 13.7812 15.5Z"
                      fill="currentColor"
                    />
                  </svg>
                }
                variant="secondary"
                onClick={() => (window.location.href = `tel:${contactData?.personal_phone || contactData?.work_phone}`)}
              />
              <Button
                label="Message"
                iconOnly={true}
                rounded={screenSize === "sm"}
                fullWidth={screenSize !== "sm"}
                icon={
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.84375 12.25C5.25 11.9375 5.78125 11.875 6.25 12.0312C7.0625 12.3438 8 12.5 9 12.5C12.875 12.5 15.5 10 15.5 7.5C15.5 5.03125 12.875 2.5 9 2.5C5.09375 2.5 2.5 5.03125 2.5 7.5C2.5 8.5 2.875 9.46875 3.59375 10.3125C3.875 10.5938 4 11 3.96875 11.4062C3.9375 11.9688 3.78125 12.5 3.625 12.9688C4.15625 12.7188 4.59375 12.4375 4.84375 12.25ZM1.65625 13.5C1.71875 13.4375 1.75 13.3438 1.8125 13.25C2.125 12.75 2.40625 12.0625 2.46875 11.2812C1.53125 10.2188 1 8.9375 1 7.5C1 3.9375 4.5625 1 9 1C13.4062 1 17 3.9375 17 7.5C17 11.0938 13.4062 14 9 14C7.8125 14 6.71875 13.8125 5.71875 13.4688C5.375 13.7188 4.75 14.0938 4.03125 14.4062C3.5625 14.625 3.03125 14.8125 2.46875 14.9062C2.4375 14.9062 2.40625 14.9375 2.40625 14.9375C2.25 14.9688 2.125 14.9688 1.96875 15C1.8125 15 1.65625 15.0312 1.46875 15.0312C1.28125 15.0312 1.09375 14.9062 1.03125 14.7188C0.9375 14.5312 1 14.3125 1.125 14.1562C1.25 14.0312 1.375 13.9062 1.46875 13.75C1.53125 13.6562 1.59375 13.5938 1.625 13.5312C1.625 13.5312 1.625 13.5312 1.625 13.5H1.65625Z"
                      fill="currentColor"
                    />
                  </svg>
                }
                variant="secondary"
                onClick={() => (window.location.href = `sms:?&body=Hi ${contactData?.fname}!`)}
              />
              <Button
                label="Email"
                iconOnly={true}
                rounded={screenSize === "sm"}
                fullWidth={screenSize !== "sm"}
                disabled={!contactData?.personal_email && !contactData?.work_email}
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 3.5C1.71875 3.5 1.5 3.75 1.5 4V4.71875L6.875 9.125C7.53125 9.65625 8.4375 9.65625 9.09375 9.125L14.5 4.71875V4C14.5 3.75 14.25 3.5 14 3.5H2ZM1.5 6.65625V12C1.5 12.2812 1.71875 12.5 2 12.5H14C14.25 12.5 14.5 12.2812 14.5 12V6.65625L10.0625 10.2812C8.84375 11.2812 7.125 11.2812 5.9375 10.2812L1.5 6.65625ZM0 4C0 2.90625 0.875 2 2 2H14C15.0938 2 16 2.90625 16 4V12C16 13.125 15.0938 14 14 14H2C0.875 14 0 13.125 0 12V4Z"
                      fill="currentColor"
                    />
                  </svg>
                }
                variant="secondary"
                onClick={() =>
                  (window.location.href = `mailto:${contactData?.personal_email || contactData?.work_email}`)
                }
              />
              <Button
                label="Favorite"
                iconOnly={true}
                rounded={screenSize === "sm"}
                fullWidth={screenSize !== "sm"}
                icon={
                  isFavorite ? (
                    <svg
                      width="18"
                      height="17"
                      viewBox="0 0 18 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.875 0.5625L11.9062 4.71875L16.375 5.375C16.75 5.4375 17.0625 5.6875 17.1875 6.0625C17.3125 6.40625 17.2188 6.8125 16.9375 7.0625L13.6875 10.2812L14.4688 14.8438C14.5312 15.2188 14.375 15.5938 14.0625 15.8125C13.75 16.0625 13.3438 16.0625 13 15.9062L9 13.75L4.96875 15.9062C4.65625 16.0625 4.25 16.0625 3.9375 15.8125C3.625 15.5938 3.46875 15.2188 3.53125 14.8438L4.28125 10.2812L1.03125 7.0625C0.78125 6.8125 0.6875 6.40625 0.78125 6.0625C0.90625 5.6875 1.21875 5.4375 1.59375 5.375L6.09375 4.71875L8.09375 0.5625C8.25 0.21875 8.59375 0 9 0C9.375 0 9.71875 0.21875 9.875 0.5625Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="17"
                      viewBox="0 0 18 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.96875 0C9.28125 0 9.53125 0.1875 9.65625 0.4375L11.8125 4.84375L16.5938 5.5625C16.875 5.59375 17.0938 5.78125 17.1875 6.0625C17.2812 6.34375 17.2188 6.625 17 6.84375L13.5312 10.2812L14.3438 15.125C14.4062 15.4062 14.2812 15.7188 14.0625 15.875C13.8125 16.0312 13.5 16.0625 13.25 15.9375L8.96875 13.625L4.71875 15.9375C4.4375 16.0625 4.15625 16.0312 3.90625 15.875C3.6875 15.6875 3.5625 15.4062 3.625 15.125L4.4375 10.2812L0.96875 6.84375C0.75 6.625 0.6875 6.34375 0.78125 6.0625C0.875 5.8125 1.09375 5.59375 1.375 5.5625L6.15625 4.84375L8.3125 0.4375C8.4375 0.1875 8.6875 0 8.96875 0ZM8.96875 2.46875L7.34375 5.875C7.21875 6.09375 7.03125 6.25 6.78125 6.28125L3.09375 6.8125L5.75 9.46875C5.9375 9.65625 6.03125 9.90625 5.96875 10.125L5.34375 13.875L8.625 12.125C8.84375 12 9.125 12 9.34375 12.125L12.625 13.875L12 10.1562C11.9375 9.90625 12.0312 9.65625 12.2188 9.5L14.875 6.8125L11.1875 6.28125C10.9375 6.25 10.75 6.09375 10.625 5.875L8.96875 2.46875Z"
                        fill="currentColor"
                      />
                    </svg>
                  )
                }
                variant="secondary"
                onClick={handleFavorite}
              />
            </div>
          </Card>
        ) : null}

        {contactData?.personal_phone || contactData?.work_phone ? (
          <div className="contact-details__card-group">
            {contactData?.personal_phone ? (
              <Card>
                <h2>Personal Phone</h2>
                <p>
                  <a href={`tel:${contactData?.personal_phone}`}>{contactData?.personal_phone}</a>
                </p>
              </Card>
            ) : null}
            {contactData?.work_phone ? (
              <Card>
                <h2>Work Phone</h2>
                <p>
                  <a href={`tel:${contactData?.work_phone}`}>{contactData?.work_phone}</a>
                </p>
              </Card>
            ) : null}
          </div>
        ) : null}

        {contactData?.personal_email || contactData?.work_email ? (
          <div className="contact-details__card-group">
            {contactData?.personal_email ? (
              <Card>
                <h2>Personal Email</h2>
                <p>
                  <a href={`mailto:${contactData?.personal_email}`}>{contactData?.personal_email}</a>
                </p>
              </Card>
            ) : null}
            {contactData?.work_email ? (
              <Card>
                <h2>Work Email</h2>
                <p>
                  <a href={`mailto:${contactData?.work_email}`}>{contactData?.work_email}</a>
                </p>
              </Card>
            ) : null}
          </div>
        ) : null}

        {contactData?.website ? (
          <div className="contact-details__card-group">
            <Card>
              <h2>Website</h2>
              <p>
                <a
                  href={contactData?.website}
                  target="_blank"
                >
                  {contactData?.website}
                </a>
              </p>
            </Card>
          </div>
        ) : null}

        {contactData?.dob ? (
          <div className="contact-details__card-group">
            <Card>
              <h2>Birthday</h2>
              <p>
                {contactData?.dob.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Card>
          </div>
        ) : null}
      </div>
    </Panel>
  );
};

export default ContactDetails;
