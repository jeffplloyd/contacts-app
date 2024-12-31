import DOMPurify from "isomorphic-dompurify";
import pool from "./db.config";

export const sanitizedInput = (str: string) => {
  return DOMPurify.sanitize(str);
};

export const checkForExistingContact = async (fname: string, lname: string) => {
  const query = {
    text: "SELECT * FROM contacts WHERE fname = $1 AND lname = $2",
    values: [fname, lname],
  };
  const { rows } = await pool.query(query);
  if (rows.length > 0) {
    return true;
  }
  return false;
};
