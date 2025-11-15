import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("user-info");
        if (saved) setUser(JSON.parse(saved));
    }, []);

    const login = (info) => {
        setUser(info);
        localStorage.setItem("user-info", JSON.stringify(info));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user-info");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
