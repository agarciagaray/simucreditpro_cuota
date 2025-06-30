import React from 'react';
import type { CreditProfiles } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, AlertCircle } from 'lucide-react';

export type FormData = {
    profile: string;
    paymentValue: string;
    termMonths: string;
    insuranceType: 'inicial' | 'saldo';
};

type SimulatorFormProps = {
    profiles: CreditProfiles;
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
};

export function SimulatorForm({ profiles, onSubmit, isLoading }: SimulatorFormProps) {
    const [formData, setFormData] = React.useState<FormData>({
        profile: '',
        paymentValue: '',
        termMonths: '',
        insuranceType: 'inicial',
    });
    const [errors, setErrors] = React.useState<Record<string, string | null>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string | null> = {};
        if (!formData.profile) newErrors.profile = 'Por favor seleccione un perfil.';
        const payment = parseFloat(formData.paymentValue);
        if (isNaN(payment) || payment <= 0) newErrors.paymentValue = 'Ingrese un valor de cuota válido.';
        const term = parseInt(formData.termMonths);
        if (isNaN(term) || term <= 0 || term > 120) newErrors.termMonths = 'Ingrese un plazo válido (1-120).';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return (
        <Card className="mb-6 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    Simulador de Crédito
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="form-group space-y-2">
                        <Label htmlFor="profile">Perfil de Crédito</Label>
                        <Select value={formData.profile} onValueChange={(value) => handleChange('profile', value)}>
                            <SelectTrigger id="profile" className={errors.profile ? 'border-destructive' : ''}>
                                <SelectValue placeholder="Seleccione un perfil" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(profiles).map(profile => (
                                    <SelectItem key={profile.id} value={profile.id}>{profile.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.profile && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.profile}</p>}
                    </div>

                    <div className="form-group space-y-2">
                        <Label htmlFor="payment-value">Cuota (Capital + Interés)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                                type="number"
                                id="payment-value"
                                placeholder="Ej: 500000"
                                value={formData.paymentValue}
                                onChange={(e) => handleChange('paymentValue', e.target.value)}
                                className={`pl-8 ${errors.paymentValue ? 'border-destructive' : ''}`}
                            />
                        </div>
                         {errors.paymentValue && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.paymentValue}</p>}
                    </div>

                    <div className="form-group space-y-2">
                        <Label htmlFor="term-months">Plazo en Meses</Label>
                        <Input
                            type="number"
                            id="term-months"
                            placeholder="Ej: 24"
                            min="1"
                            max="120"
                            value={formData.termMonths}
                            onChange={(e) => handleChange('termMonths', e.target.value)}
                            className={errors.termMonths ? 'border-destructive' : ''}
                        />
                         {errors.termMonths && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.termMonths}</p>}
                    </div>

                    <div className="form-group space-y-2">
                        <Label htmlFor="insurance-type">Cálculo del Seguro</Label>
                        <Select value={formData.insuranceType} onValueChange={(value: 'inicial' | 'saldo') => handleChange('insuranceType', value)}>
                            <SelectTrigger id="insurance-type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inicial">Sobre Valor Inicial</SelectItem>
                                <SelectItem value="saldo">Sobre Saldo de Capital</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end items-end">
                        <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
                             <Calculator className="mr-2 h-5 w-5" />
                            {isLoading ? 'Calculando...' : 'Calcular'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
