import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./Form.scss";
import FormField from "../FormField/FormField";
import { useFormik } from "formik";
import SelectField from "../SelectField/SelectField";
import { getRoles } from "../../services/roles";
import { useToast } from "../../hooks/useToast";
import { ContactDetailsType } from "../../services/contacts";

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
    },
    onSubmit: (values) => {
      console.log(values);
    },
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
        />
        <FormField
          label="Last Name"
          type="text"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
        />
        <SelectField
          label="Company Role"
          name="role"
          placeholder="Select a role..."
          value={formik.values.role}
          onChange={formik.handleChange}
          options={roles}
        />
      </fieldset>
      <fieldset>
        <FormField
          label="Personal Phone"
          type="tel"
          name="personalPhone"
          value={formik.values.personal_phone}
          onChange={formik.handleChange}
        />
        <FormField
          label="Work Phone"
          type="tel"
          name="workPhone"
          value={formik.values.work_phone}
          onChange={formik.handleChange}
        />
      </fieldset>
      <fieldset>
        <FormField
          label="Personal Email"
          type="email"
          name="personalemail"
          value={formik.values.personal_email}
          onChange={formik.handleChange}
        />
        <FormField
          label="Work Email"
          type="email"
          name="workEmail"
          value={formik.values.work_email}
          onChange={formik.handleChange}
        />
      </fieldset>
      <FormField
        label="Website"
        type="text"
        name="webSite"
        value={formik.values.website}
        onChange={formik.handleChange}
      />
    </form>
  );
});

export default ContactForm;
