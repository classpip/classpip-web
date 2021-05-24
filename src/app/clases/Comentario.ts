import { Profesor } from './Profesor';
export class Comentario {
    comentario: string;
    fecha: string;
    likes: number;
    id: number;
    autorId: number;
    autor: Profesor;
    publicacionId: number;

    constructor(comentario: string, fecha: string, likes: number, autorId: number, publicacionId: number, autor?: Profesor, id?: number) {
        this.comentario = comentario;
        this.fecha = fecha;
        this.likes = likes;
        this.autorId = autorId;
        this.autor = autor;
        this.publicacionId = publicacionId;
        this.id = id;
    }
}
  