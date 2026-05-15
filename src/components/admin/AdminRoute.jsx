import { Navigate, useLocation } from 'react-router-dom';
import { getStoredAdminCandidate } from '../../utils/authStorage';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const user = getStoredAdminCandidate();
  const isAdmin =
    user?.isAdmin === true || 
    String(user?.email || '').trim().toLowerCase() === 'admin@class360.com';

  if (!isAdmin) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}
