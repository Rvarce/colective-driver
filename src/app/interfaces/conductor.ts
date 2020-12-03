export interface Conductor {
    perfil: {
        nombre: string,
        apellidoPaterno: string,
        apellidoMaterno: string,
        direccion: string, 
        comuna: string,
        ciudad: string,
        pais: string,
        email: string,
    },
    vehiculo: {
        dueño: boolean,
        marcaVehiculo: string,
        modeloVehiculo: string,
        patenteVehiculo: string,
    },
    configIngresos: {
        valorPasaje: number,
        intervalo: string,
    },
    configGastos: {
        combustible: number,
        entrega: number,
        otros: [
            {
                descripcion: string,
                valor: number
            }
        ]
    }
}
