import DOMPurify from "isomorphic-dompurify";
import pool from "./db.config";

export const sanitizedInput = (str: string) => {
  return DOMPurify.sanitize(str);
};

export const checkForExistingContact = async (fname: string, lname: string, id?: number) => {
  const query = {
    text: "SELECT id FROM contacts WHERE fname = $1 AND lname = $2",
    values: [fname, lname],
  };
  const { rows } = await pool.query(query);
  if (rows.length > 0) {
    if (id && rows[0].id === id) {
      return false;
    }
    return true;
  }
  return false;
};
