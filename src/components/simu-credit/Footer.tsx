'use client';

import React, { useState, useEffect } from 'react';

export function Footer() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4 text-center">
                <p>&copy; {year} SimuCredit Pro. Todos los derechos reservados.</p>
                <p className="text-gray-400 text-sm mt-1">Simulador de créditos y cálculo de amortización</p>
            </div>
        </footer>
    );
}
