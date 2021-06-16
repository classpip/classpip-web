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
    isLike: boolean;
    ficheros: string[];
    imagenes: string[];

    constructor(titulo: string, publicacion: string, fecha: string, autor: number, comentarios: Array<Comentario>, likes: Array<Profesor>, ficheros?: string[], imagenes?: string[], id?: number){
        this.titulo = titulo;
        this.publicacion = publicacion;
        this.fecha = fecha;
        this.autorId = autor;
        this.comentarios = comentarios;
        this.likes = likes;
        this.ficheros = ficheros;
        this.imagenes = imagenes;
        this.id = id;
    }
}