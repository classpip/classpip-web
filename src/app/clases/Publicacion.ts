import { Profesor } from './Profesor';
import { Comentario } from './Comentario';

export class Publicacion {
    titulo: string;
    publicacion: string;
    fecha: string;
    autorId: number;
    comentarios: Array<Comentario>;
    likes: Array<Profesor>;
    id: number;
    autor: any;

    constructor(titulo: string, publicacion: string, fecha: string, autor: number, comentarios: Array<Comentario>, likes: Array<Profesor>, id?: number){
        this.titulo = titulo;
        this.publicacion = publicacion;
        this.fecha = fecha;
        this.autorId = autor;
        this.comentarios = comentarios;
        this.likes = likes;
        this.id = id;
    }
}