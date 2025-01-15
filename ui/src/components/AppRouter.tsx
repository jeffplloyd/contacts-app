import { Routes, Route } from "react-router-dom";
import ContactDetails from "../views/ContactDetails/ContactDetails";

interface AppRouterProps {
  onContactDeleted?: () => void;
  onFavorite?: (id: number) => void;
  onContactUpdated?: () => void;
}

const AppRouter = ({ onFavorite, onContactDeleted }: AppRouterProps) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<ContactDetails />}
      />
      <Route
        path="contact/:contactId"
        element={
          <ContactDetails
            onContactDeleted={onContactDeleted}
            onFavorite={onFavorite}
          />
        }
      />
    </Routes>
  );
};

export default AppRouter;
