import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdminLoggedIn } from "../utils/adminAuth";

export default function RequireAdmin() {
  const location = useLocation();
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin-login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

