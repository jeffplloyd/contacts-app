import { Routes, Route } from "react-router-dom";
import ContactDetails from "../views/ContactDetails/ContactDetails";
import Empty from "../views/Empty/Empty";

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
        element={<Empty />}
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
      <Route
        path="*"
        element={<Empty />}
      />
    </Routes>
  );
};

export default AppRouter;
