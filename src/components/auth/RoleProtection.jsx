import { Navigate, useLocation } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
import Loader from "@/components/shared/Loader";

export function RoleProtectedRoute({ children, allowedRoles }) {
  const { selectedWorkspace, isLoading } = useWorkspace();
  const location = useLocation();
  const userRole = selectedWorkspace?.user_role;

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedWorkspace || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}