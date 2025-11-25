import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import type { UserRole } from '../types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const roleRedirects: Record<UserRole, string> = {
  Customer: '/customer/dashboard',
  Agent: '/agent/dashboard',
  Manager: '/manager/approvals',
  Admin: '/admin/funds',
};

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const user = useAppSelector((state) => state.auth.user);
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={user?.role ? roleRedirects[user.role] : '/login'} replace />;
  }
  
  return <>{children}</>;
}
