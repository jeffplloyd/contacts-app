import DOMPurify from "isomorphic-dompurify";

export const sanitizedInput = (str: string) => {
  return DOMPurify.sanitize(str);
};