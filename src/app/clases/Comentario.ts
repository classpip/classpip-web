export class Comentario {
    comentario: string;
    fecha: Date;
    likes: number;
    id: number;
    autorId: number;
    publicacionId: number;

    constructor(comentario: string, fecha: Date, likes: number, autorId: number, publicacionId: number, id?: number) {
        this.comentario = comentario;
        this.fecha = fecha;
        this.likes = likes;
        this.autorId = autorId;
        this.publicacionId = publicacionId;
        this.id = id;
    }
}
  