import { Outlet, Navigate } from 'react-router';
import { useAuth } from './AuthProvider';

const ProtectedRoutes = () => {
    const auth = useAuth();
    if (auth.token === "") return <Navigate to="/login" />

    return <Outlet />
}

export default ProtectedRoutes