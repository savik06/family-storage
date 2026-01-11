"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/components/types"; // твой тип

const UserContext = createContext<{
    userId: string;
    setUserId: (id: string) => void;
    user: User | null;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ userId, setUserId, user }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUserContext must be used within UserProvider");
    return context;
};
