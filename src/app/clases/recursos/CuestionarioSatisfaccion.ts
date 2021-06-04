export class CuestionarioSatisfaccion {
    titulo: string;
    descripcion: string;
    afirmaciones: string[];
    preguntasAbiertas: string[];
    profesorId: number;
    id: number;

    constructor(Titulo?: string, Descripcion?: string, Afirmaciones?: string[], PreguntasAbiertas?: string[], profesorId?: number) {
        this.titulo = Titulo;
        this.descripcion = Descripcion;
        this.afirmaciones = Afirmaciones;
        this.preguntasAbiertas = PreguntasAbiertas;
        this.profesorId = profesorId;
    }
}

