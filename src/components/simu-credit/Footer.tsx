export function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4 text-center">
                <p>&copy; {new Date().getFullYear()} SimuCredit Pro. Todos los derechos reservados.</p>
                <p className="text-gray-400 text-sm mt-1">Simulador de créditos y cálculo de amortización</p>
            </div>
        </footer>
    );
}
