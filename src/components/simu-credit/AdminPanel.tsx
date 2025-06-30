import type { CreditProfiles } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

type AdminPanelProps = {
    profiles: CreditProfiles;
    onProfilesChange: (newProfiles: CreditProfiles) => void;
};

export function AdminPanel({ profiles, onProfilesChange }: AdminPanelProps) {
    const { toast } = useToast();

    const handleInputChange = (profileKey: string, field: string, value: string) => {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            const updatedProfiles = {
                ...profiles,
                [profileKey]: {
                    ...profiles[profileKey],
                    [field]: numericValue,
                },
            };
            onProfilesChange(updatedProfiles);
        }
    };
    
    const handleSaveChanges = () => {
        localStorage.setItem('creditProfiles', JSON.stringify(profiles));
        toast({
            title: "Perfiles guardados",
            description: "Los cambios en los perfiles de crédito han sido guardados en el navegador.",
            variant: 'default',
        })
    };

    return (
        <Card className="mb-6 fade-in shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Configuración de Perfiles de Crédito
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Perfil</TableHead>
                                <TableHead>Tasa N.M.V (%)</TableHead>
                                <TableHead>Afianzamiento (%)</TableHead>
                                <TableHead>Int. Carencia (días)</TableHead>
                                <TableHead>Seguro (%)</TableHead>
                                <TableHead>Corredor (%)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(profiles).map(([key, profile]) => (
                                <TableRow key={key}>
                                    <TableCell className="font-medium">Perfil {key}</TableCell>
                                    <TableCell>
                                        <Input type="number" value={profile.tasa} onChange={(e) => handleInputChange(key, 'tasa', e.target.value)} className="w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" value={profile.afianzamiento} onChange={(e) => handleInputChange(key, 'afianzamiento', e.target.value)} className="w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" value={profile.diasCarencia} onChange={(e) => handleInputChange(key, 'diasCarencia', e.target.value)} className="w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" value={profile.seguro} onChange={(e) => handleInputChange(key, 'seguro', e.target.value)} className="w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" value={profile.corredor} onChange={(e) => handleInputChange(key, 'corredor', e.target.value)} className="w-24" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSaveChanges} className="bg-accent hover:bg-accent/90">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
