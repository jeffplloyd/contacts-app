import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./Form.scss";
import FormField from "../FormField/FormField";
import { useFormik } from "formik";
import SelectField from "../SelectField/SelectField";
import { getRoles } from "../../services/roles";
import { useToast } from "../../hooks/useToast";
import { ContactDetailsType } from "../../services/contacts";
import { contactFormSchema } from "./utils";

interface ContactFormProps {
  contact?: ContactDetailsType | null;
}

interface RoleOption {
  value: string;
  label: string;
}

export type ContactFormRef = {
  submit: () => void;
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
};

const ContactForm = forwardRef<ContactFormRef, ContactFormProps>(({ contact }, ref) => {
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const toast = useToast();
  const hasFetched = useRef(false);
  const formik = useFormik({
    initialValues: {
      firstName: contact?.fname || "",
      lastName: contact?.lname || "",
      role: contact?.role_id?.toString() || "",
      personal_email: contact?.personal_email || "",
      work_email: contact?.work_email || "",
      personal_phone: contact?.personal_phone || "",
      work_phone: contact?.work_phone || "",
      website: contact?.website || "",
      dob: contact?.dob ? new Date(contact.dob).toLocaleDateString("en", dateFormatOptions) : "",
    },
    validationSchema: contactFormSchema,
    onSubmit: (values) => {
      console.log("onSubmit", values);
    },
    validateOnChange: false,
  });

  useImperativeHandle(ref, () => ({
    submit: formik.submitForm,
  }));

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    fetchRoles();
  }, []);

  useEffect(() => {
    if (formik.isValid) return;
    toast.error("Form validation errors", 5000, { text: "Dismiss" });
  }, [formik.errors]);

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      const roles: RoleOption[] = response.map((role) => ({ value: role.id.toString(), label: role.name }));
      setRoles(roles);
    } catch (error) {
      if (error instanceof Error && error.message === "Failed to fetch") {
        toast.error("Failed to fetch roles", null, {
          text: "Retry",
          onClick: (id?: string) => {
            fetchRoles();
            if (id) toast.removeToast(id);
          },
        });
        return;
      }
    }
  };

  return (
    <form className="form">
      <fieldset>
        <FormField
          label="First Name"
          type="text"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          invalid={!!formik.errors.firstName}
          helperText={
            formik.errors.firstName ? (
              <span className="form-field__helper-text form-field__helper-text--error">{formik.errors.firstName}</span>
            ) : null
          }
        />
        <FormField
          label="Last Name"
          type="text"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          invalid={!!formik.errors.lastName}
          helperText={
            formik.errors.lastName ? (
              <span className="form-field__helper-text form-field__helper-text--error">{formik.errors.lastName}</span>
            ) : null
          }
        />
        <SelectField
          label="Company Role"
          name="role"
          placeholder="Select a role..."
          value={formik.values.role}
          onChange={formik.handleChange}
          options={roles}
          invalid={!!formik.errors.role}
          helperText={
            formik.errors.role ? (
              <span className="form-field__helper-text form-field__helper-text--error">{formik.errors.role}</span>
            ) : null
          }
        />
      </fieldset>
      <fieldset>
        <FormField
          label="Personal Phone"
          type="tel"
          name="personal_phone"
          value={formik.values.personal_phone}
          onChange={formik.handleChange}
          invalid={!!formik.errors.personal_phone}
          helperText={
            formik.errors.personal_phone ? (
              <span className="form-field__helper-text form-field__helper-text--error">
                {formik.errors.personal_phone}
              </span>
            ) : null
          }
        />
        <FormField
          label="Work Phone"
          type="tel"
          name="work_phone"
          value={formik.values.work_phone}
          onChange={formik.handleChange}
          invalid={!!formik.errors.work_phone}
          helperText={
            formik.errors.work_phone ? (
              <span className="form-field__helper-text form-field__helper-text--error">{formik.errors.work_phone}</span>
            ) : null
          }
        />
      </fieldset>
      <fieldset>
        <FormField
          label="Personal Email"
          type="email"
          name="personal_email"
          value={formik.values.personal_email}
          onChange={formik.handleChange}
          invalid={!!formik.errors.personal_email}
          helperText={
            formik.errors.personal_email ? (
              <span className="form-field__helper-text form-field__helper-text--error">
                {formik.errors.personal_email}
              </span>
            ) : null
          }
        />
        <FormField
          label="Work Email"
          type="email"
          name="work_email"
          value={formik.values.work_email}
          onChange={formik.handleChange}
          invalid={!!formik.errors.work_email}
          helperText={
            formik.errors.work_email ? (
              <span className="form-field__helper-text form-field__helper-text--error">{formik.errors.work_email}</span>
            ) : null
          }
        />
      </fieldset>
      <FormField
        label="Website"
        type="text"
        name="website"
        value={formik.values.website}
        onChange={formik.handleChange}
        invalid={!!formik.errors.website}
        helperText={
          formik.errors.website ? (
            <span className="form-field__helper-text form-field__helper-text--error">{formik.errors.website}</span>
          ) : null
        }
      />
      <FormField
        label="Birthday"
        type="date"
        name="dob"
        placeholder="MM/DD/YYYY"
        value={formik.values.dob}
        onChange={formik.handleChange}
        invalid={!!formik.errors.dob}
        helperText={
          formik.errors.dob ? (
            <span className="form-field__helper-text form-field__helper-text--error">{formik.errors.dob}</span>
          ) : null
        }
      />
    </form>
  );
});

export default ContactForm;
