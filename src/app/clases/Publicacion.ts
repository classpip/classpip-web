export class Publicacion {
    titulo: string;
    publicacion: string;
    fecha: string;
    autorId: number;
    comentarios: Array<number>;
    likes: Array<number>;
    id: number;
    autor: any;

    constructor(titulo: string, publicacion: string, fecha: string, autor: number, comentarios: Array<number>, likes: Array<number>, id?: number){
        this.titulo = titulo;
        this.publicacion = publicacion;
        this.fecha = fecha;
        this.autorId = autor;
        this.comentarios = comentarios;
        this.likes = likes;
        this.id = id;
    }
}