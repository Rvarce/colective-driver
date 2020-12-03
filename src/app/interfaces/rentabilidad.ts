export interface Rentabilidad {
    horaTomaPasajeros: [
        {
            fecha: string,
            hora: string
        }
    ],
    numPasajeros: number,
    totalGastos: number,
    totalIngresos: number
}
