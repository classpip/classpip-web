import { Profesor } from './Profesor';
export class Comentario {
    comentario: string;
    fecha: string;
    id: number;
    autorId: number;
    autor: Profesor;
    publicacionId: number;
    isPropietario: boolean;

    constructor(comentario: string, fecha: string, autorId: number, publicacionId: number, autor?: Profesor, id?: number) {
        this.comentario = comentario;
        this.fecha = fecha;
        this.autorId = autorId;
        this.autor = autor;
        this.publicacionId = publicacionId;
        this.id = id;
    }
}
  