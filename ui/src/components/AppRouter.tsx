import { Routes, Route } from "react-router-dom";
import ContactDetails from "../views/ContactDetails/ContactDetails";

const AppRouter = ({ onContactDeleted }: { onContactDeleted?: () => void }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<ContactDetails />}
      />
      <Route
        path="contact/:contactId"
        element={<ContactDetails onContactDeleted={onContactDeleted} />}
      />
    </Routes>
  );
};

export default AppRouter;
