export class Publicacion {
    publicacion: string;
    fecha: Date;
    autorId: number;
    comentarios: Array<number>;
    likes: Array<number>;
    id: number;

    constructor(publicacion: string, fecha: Date, autor: number, comentarios: Array<number>, likes: Array<number>, id?: number){
        this.publicacion = publicacion;
        this.fecha = fecha;
        this.autorId = autor;
        this.comentarios = comentarios;
        this.likes = likes;
        this.id = id;
    }
}