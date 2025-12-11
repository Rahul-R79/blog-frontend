import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import authservice from "../services/authService";

interface User {
    id: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const response = await authservice.getMe();

                if (response.valid) {
                    setUser({
                        id: response.userId,
                    });
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    const isAuthenticated = Boolean(user);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;
