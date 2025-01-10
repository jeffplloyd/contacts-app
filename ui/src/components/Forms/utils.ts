import * as Yup from "yup";

export const contactFormSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  role: Yup.string().required("Role is required"),
  personal_email: Yup.string().email("Invalid email"),
  work_email: Yup.string().email("Invalid email"),
  personal_phone: Yup.string(),
  work_phone: Yup.string(),
  website: Yup.string().url("Invalid URL"),
  dob: Yup.string().matches(
    /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/,
    "Date must be a valid date and in MM/DD/YYYY format"
  ),
});
