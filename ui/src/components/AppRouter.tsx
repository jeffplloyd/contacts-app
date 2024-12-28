import { Routes, Route } from 'react-router-dom';
import ContactDetails from '../views/ContactDetails/ContactDetails';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ContactDetails />} />
      <Route path="contact/:contactId" element={<ContactDetails />} />
    </Routes>
  );
};

export default AppRouter;