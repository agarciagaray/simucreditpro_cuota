'use client';

import React, { useState } from 'react';
import type { CreditProfile } from '@/types';
import { useCreditProfiles } from '@/hooks/use-credit-profiles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, PlusCircle, Edit, Trash2, Save, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label';

const ProfileForm = ({ profile, onSave, onCancel }: { profile?: CreditProfile, onSave: (profile: CreditProfile) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        tasa: profile?.tasa || 0,
        afianzamiento: profile?.afianzamiento || 0,
        diasCarencia: profile?.diasCarencia || 0,
        seguro: profile?.seguro || 0,
        corredor: profile?.corredor || 0,
    });

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: field === 'name' ? value : parseFloat(value) || 0 }));
    };

    const handleSave = () => {
        onSave({ id: profile?.id || '', ...formData });
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tasa" className="text-right">Tasa N.M.V (%)</Label>
                <Input id="tasa" type="number" value={formData.tasa} onChange={e => handleChange('tasa', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="afianzamiento" className="text-right">Afianzamiento (%)</Label>
                <Input id="afianzamiento" type="number" value={formData.afianzamiento} onChange={e => handleChange('afianzamiento', e.target.value)} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="diasCarencia" className="text-right">Int. Carencia (días)</Label>
                <Input id="diasCarencia" type="number" value={formData.diasCarencia} onChange={e => handleChange('diasCarencia', e.target.value)} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="seguro" className="text-right">Seguro (%)</Label>
                <Input id="seguro" type="number" value={formData.seguro} onChange={e => handleChange('seguro', e.target.value)} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="corredor" className="text-right">Corredor (%)</Label>
                <Input id="corredor" type="number" value={formData.corredor} onChange={e => handleChange('corredor', e.target.value)} className="col-span-3" />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Guardar</Button>
            </DialogFooter>
        </div>
    );
};

export function ProfilesPanel() {
    const { profiles, isLoaded, addProfile, updateProfile, deleteProfile } = useCreditProfiles();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<CreditProfile | undefined>(undefined);

    if (!isLoaded) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    const handleEditClick = (profile: CreditProfile) => {
        setEditingProfile(profile);
        setIsFormOpen(true);
    };
    
    const handleAddNewClick = () => {
        setEditingProfile(undefined);
        setIsFormOpen(true);
    };

    const handleSaveProfile = (profileData: CreditProfile) => {
        if (editingProfile) {
            updateProfile(profileData.id, profileData);
        } else {
            const { id, ...newProfileData } = profileData;
            addProfile(newProfileData);
        }
        setIsFormOpen(false);
        setEditingProfile(undefined);
    };

    const handleDeleteProfile = (profileId: string) => {
        deleteProfile(profileId);
    };

    return (
        <Card className="fade-in shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Configuración de Perfiles de Crédito
                </CardTitle>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                         <Button onClick={handleAddNewClick}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Añadir Perfil
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingProfile ? 'Editar Perfil' : 'Añadir Nuevo Perfil'}</DialogTitle>
                        </DialogHeader>
                        <ProfileForm 
                          profile={editingProfile}
                          onSave={handleSaveProfile}
                          onCancel={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Tasa %</TableHead>
                                <TableHead>Afian. %</TableHead>
                                <TableHead>Carencia</TableHead>
                                <TableHead>Seguro %</TableHead>
                                <TableHead>Corredor %</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.values(profiles).map((profile) => (
                                <TableRow key={profile.id}>
                                    <TableCell className="font-medium">{profile.name}</TableCell>
                                    <TableCell>{profile.tasa}</TableCell>
                                    <TableCell>{profile.afianzamiento}</TableCell>
                                    <TableCell>{profile.diasCarencia}</TableCell>
                                    <TableCell>{profile.seguro}</TableCell>
                                    <TableCell>{profile.corredor}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(profile)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede deshacer. Se eliminará permanentemente el perfil.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteProfile(profile.id)} className="bg-destructive hover:bg-destructive/90">
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
