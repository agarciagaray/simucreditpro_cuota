'use client';

import { useState, useEffect } from 'react';
import type { Users, User } from '@/types';
import { useToast } from "@/hooks/use-toast"

const initialUsers: Users = {
    'user-1': { id: 'user-1', name: 'Juan Administrador', username: 'admin', role: 'ADMIN' },
    'user-2': { id: 'user-2', name: 'Pedro Usuario', username: 'user', role: 'USER' },
};

export function useUsers() {
    const [users, setUsers] = useState<Users>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const savedUsers = localStorage.getItem('appUsers');
            if (savedUsers) {
                setUsers(JSON.parse(savedUsers));
            } else {
                setUsers(initialUsers);
                localStorage.setItem('appUsers', JSON.stringify(initialUsers));
            }
        } catch (error) {
            console.error("Failed to process users from localStorage", error);
            setUsers(initialUsers);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const saveUsers = (newUsers: Users) => {
        setUsers(newUsers);
        localStorage.setItem('appUsers', JSON.stringify(newUsers));
    };
    
    const addUser = (newUserData: Omit<User, 'id'>) => {
        const newId = `user-${Date.now()}`;
        const userWithId: User = { ...newUserData, id: newId };
        const updatedUsers = { ...users, [newId]: userWithId };
        saveUsers(updatedUsers);
        toast({ title: "Usuario creado", description: "El nuevo usuario ha sido añadido." });
    };

    const updateUser = (userId: string, updatedUser: User) => {
        const updatedUsers = { ...users, [userId]: updatedUser };
        saveUsers(updatedUsers);
        toast({ title: "Usuario actualizado", description: "El usuario ha sido guardado." });
    };

    const deleteUser = (userId: string) => {
        const { [userId]: _, ...remainingUsers } = users;
        saveUsers(remainingUsers);
        toast({ title: "Usuario eliminado", description: "El usuario ha sido borrado." });
    };

    return { users, isLoaded, addUser, updateUser, deleteUser };
}
