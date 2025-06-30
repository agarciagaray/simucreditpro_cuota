'use client';

import React, { useState } from 'react';
import type { User } from '@/types';
import { useUsers } from '@/hooks/use-users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon, PlusCircle, Edit, Trash2, Save, Loader2 } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const UserForm = ({ user, onSave, onCancel }: { user?: User, onSave: (data: Omit<User, 'id'> & { id?: string }) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        password: '',
        role: user?.role || 'USER',
    });

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        const dataToSave: Omit<User, 'id'> & { id?: string } = {
            ...formData,
        };
        if (user?.id) {
            dataToSave.id = user.id;
        }
        onSave(dataToSave);
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">Username</Label>
                <Input id="username" value={formData.username} onChange={e => handleChange('username', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Contraseña</Label>
                <Input id="password" type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} className="col-span-3" placeholder={user ? 'Dejar en blanco para no cambiar' : ''} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rol</Label>
                <Select value={formData.role} onValueChange={(value: 'USER' | 'ADMIN') => handleChange('role', value)}>
                    <SelectTrigger id="role" className="col-span-3">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">Usuario</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Guardar</Button>
            </DialogFooter>
        </div>
    );
};

export function UsersPanel() {
    const { users, isLoaded, addUser, updateUser, deleteUser } = useUsers();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
    const { toast } = useToast();

    if (!isLoaded) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };
    
    const handleAddNewClick = () => {
        setEditingUser(undefined);
        setIsFormOpen(true);
    };

    const handleSaveUser = (userData: Omit<User, 'id'> & { id?: string, password?: string }) => {
        if (editingUser) {
            const finalUserData: User = {
                ...editingUser,
                name: userData.name,
                username: userData.username,
                role: userData.role,
                // Only update password if a new one was provided
                password: userData.password ? userData.password : editingUser.password,
            };
            updateUser(editingUser.id, finalUserData);
        } else {
            // Creating a new user
            if (!userData.password) {
                toast({
                    title: "Error de validación",
                    description: "La contraseña es obligatoria para nuevos usuarios.",
                    variant: "destructive",
                });
                return;
            }
            const { id, ...newUserData } = userData;
            addUser(newUserData as Omit<User, 'id'>);
        }
        setIsFormOpen(false);
        setEditingUser(undefined);
    };

    const handleDeleteUser = (userId: string) => {
        deleteUser(userId);
    };

    return (
        <Card className="fade-in shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-6 w-6" />
                    Gestión de Usuarios
                </CardTitle>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                         <Button onClick={handleAddNewClick}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Añadir Usuario
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</DialogTitle>
                        </DialogHeader>
                        <UserForm 
                          user={editingUser}
                          onSave={handleSaveUser}
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
                                <TableHead>Username</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.values(users).map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
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
                                                        Esta acción no se puede deshacer. Se eliminará permanentemente el usuario.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">
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
