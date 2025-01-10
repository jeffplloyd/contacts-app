import { useNavigate, useParams } from "react-router-dom";
import Panel from "../../components/Panel/Panel";
import BackButton from "../../components/BackButton/BackButton";
import "./ContactDetails.scss";
import Card from "../../components/Card/Card";
import Avatar from "../../components/Avatar/Avatar";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import { useEffect, useRef, useState } from "react";
import { ContactDetailsType, createContact, deleteContact, getContact } from "../../services/contacts";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import { useDrawer } from "../../hooks/useDrawer";
import { useToast } from "../../hooks/useToast";
import ContactForm, { ContactFormRef } from "../../components/Forms/ContactForm";

const ContactDetails = ({ onContactDeleted }: { onContactDeleted?: () => void }) => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contactData, setContactData] = useState<ContactDetailsType | null>(null);
  const drawer = useDrawer();
  const toast = useToast();
  const contactFormRef = useRef<ContactFormRef>(null);

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
      headerText: "Edit Contact",
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
      children: (
        <ContactForm
          ref={contactFormRef}
          contact={contactData}
        />
      ),
    });
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
      <div className="contact-details__heading">
        <BackButton onClick={() => navigate(-1)}>Contacts</BackButton>
      </div>
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
              <ActionsMenu
                label="Actions"
                name="contact-actions"
                items={[
                  {
                    text: "Edit",
                    value: "edit",
                    onClick: handleEditContact,
                  },
                  {
                    text: "Delete",
                    value: "delete",
                    distructive: true,
                    onClick: handleDeleteContact,
                  },
                ]}
              />
            </div>
            <div className="contact-details__actions">
              <Button
                label="Call"
                iconOnly={true}
                fullWidth={true}
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
                fullWidth={true}
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
                fullWidth={true}
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
                label="Book Appointment"
                iconOnly={true}
                fullWidth={true}
                disabled={true}
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.75 0.75V2H10.25V0.75C10.25 0.34375 10.5625 0 11 0C11.4062 0 11.75 0.34375 11.75 0.75V2H13C14.0938 2 15 2.90625 15 4V4.5V6V14C15 15.125 14.0938 16 13 16H3C1.875 16 1 15.125 1 14V6V4.5V4C1 2.90625 1.875 2 3 2H4.25V0.75C4.25 0.34375 4.5625 0 5 0C5.40625 0 5.75 0.34375 5.75 0.75ZM2.5 6V14C2.5 14.2812 2.71875 14.5 3 14.5H13C13.25 14.5 13.5 14.2812 13.5 14V6H2.5Z"
                      fill="currentColor"
                    />
                  </svg>
                }
                variant="secondary"
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
