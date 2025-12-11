import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to='/' replace />;
    }

    return children;
};

export default PublicRoute;
