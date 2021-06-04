export class Cuestionario {
    titulo: string;
    descripcion: string;
    profesorId: number;
    id: number;

    constructor(titulo?: string, descripcion?: string, profesorId?: number) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.profesorId = profesorId;
    }
}
