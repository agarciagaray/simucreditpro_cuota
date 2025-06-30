'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import type { User } from '@/types';
import { useUsers } from '@/hooks/use-users';
import { Loader2 } from 'lucide-react';

interface AppContextType {
    currentUser: User | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { users, isLoaded: usersAreLoaded } = useUsers();

    useEffect(() => {
        if (!usersAreLoaded || Object.keys(users).length === 0) return;

        try {
            const savedUserJson = sessionStorage.getItem('currentUser');
            if (savedUserJson) {
                const savedUser: User = JSON.parse(savedUserJson);
                const userFromSource = Object.values(users).find(u => u.id === savedUser.id);
                if (userFromSource) {
                    setCurrentUser(userFromSource);
                } else {
                    sessionStorage.removeItem('currentUser');
                }
            }
        } catch (error) {
            console.error("Could not parse user from session storage", error);
            sessionStorage.removeItem('currentUser');
        } finally {
            setIsLoading(false);
        }
    }, [users, usersAreLoaded]);

    const login = useCallback((username: string, password: string): boolean => {
        const user = Object.values(users).find(
            u => u.username === username && u.password === password
        );
        if (user) {
            setCurrentUser(user);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }, [users]);

    const logout = useCallback(() => {
        setCurrentUser(null);
        sessionStorage.removeItem('currentUser');
    }, []);

    const value = useMemo(() => ({
        currentUser,
        login,
        logout
    }), [currentUser, login, logout]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
