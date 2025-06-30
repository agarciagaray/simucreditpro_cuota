'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Role = 'USER' | 'ADMIN';

interface AppContextType {
    role: Role;
    toggleRole: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<Role>('USER');
    const toggleRole = () => setRole(prev => (prev === 'USER' ? 'ADMIN' : 'USER'));

    return (
        <AppContext.Provider value={{ role, toggleRole }}>
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
