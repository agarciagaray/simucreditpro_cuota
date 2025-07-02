'use client';

import { useToast } from "@/hooks/use-toast";
import type { CreditProfile, CreditProfiles } from '@/types';
import { useEffect, useState } from 'react';

const initialCreditProfiles: CreditProfiles = {
    'A': { id: 'A', name: 'Perfil A', tasa: 1.91, afianzamiento: 16.00, diasCarencia: 60, seguro: 0.45, corredor: 7.00, afiliacionCooperativa: 7000, aportesMensualesCooperativa: 3374 },
    'B': { id: 'B', name: 'Perfil B', tasa: 1.91, afianzamiento: 20.00, diasCarencia: 60, seguro: 0.45, corredor: 7.00, afiliacionCooperativa: 7000, aportesMensualesCooperativa: 3374 },
    'C': { id: 'C', name: 'Perfil C', tasa: 1.91, afianzamiento: 24.00, diasCarencia: 60, seguro: 1.40, corredor: 7.00, afiliacionCooperativa: 7000, aportesMensualesCooperativa: 3374 }
};

export function useCreditProfiles() {
    const [profiles, setProfiles] = useState<CreditProfiles>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const savedProfiles = localStorage.getItem('creditProfiles');
            if (savedProfiles) {
                setProfiles(JSON.parse(savedProfiles));
            } else {
                setProfiles(initialCreditProfiles);
                localStorage.setItem('creditProfiles', JSON.stringify(initialCreditProfiles));
            }
        } catch (error) {
            console.error("Failed to process profiles from localStorage", error);
            setProfiles(initialCreditProfiles);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const saveProfiles = (newProfiles: CreditProfiles) => {
        setProfiles(newProfiles);
        localStorage.setItem('creditProfiles', JSON.stringify(newProfiles));
    };

    const addProfile = (newProfileData: Omit<CreditProfile, 'id'>) => {
        const newId = `P${Date.now()}`;
        const profileWithId: CreditProfile = { ...newProfileData, id: newId };
        const updatedProfiles = { ...profiles, [newId]: profileWithId };
        saveProfiles(updatedProfiles);
        toast({ title: "Perfil creado", description: "El nuevo perfil ha sido añadido." });
    };

    const updateProfile = (profileId: string, updatedProfile: CreditProfile) => {
        const updatedProfiles = { ...profiles, [profileId]: updatedProfile };
        saveProfiles(updatedProfiles);
        toast({ title: "Perfil actualizado", description: "El perfil ha sido guardado." });
    };

    const deleteProfile = (profileId: string) => {
        const { [profileId]: _, ...remainingProfiles } = profiles;
        saveProfiles(remainingProfiles);
        toast({ title: "Perfil eliminado", description: "El perfil ha sido borrado." });
    };

    return { profiles, isLoaded, addProfile, updateProfile, deleteProfile };
}
