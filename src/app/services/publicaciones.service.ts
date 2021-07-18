import { Profesor } from './../clases/Profesor';
import { Publicacion } from './../clases/Publicacion';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as URL from '../URLs/urls';
import { Observable } from 'rxjs';
import { Comentario } from '../clases/Comentario';
import {tap} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private host = URL.host;

  private APIUrlPublicaciones = URL.Publicaciones;
  private APIUrlComentarios = URL.Comentarios;
  private APIUrlImagenesPublicacion = URL.ImagenesPublicaciones;
  private APIUrlFicherosPublicacion = URL.FicherosPublicaciones;

  constructor(private http: HttpClient, auth: AuthService) { }

  public damePublicaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrlPublicaciones + '?filter[include]=autor');
  }

  public dameComentariosPubli(publicacionId: number){
    return this.http.get<Comentario[]>(this.APIUrlPublicaciones + '/'+ publicacionId + '/comentarios');
  }

  public dameAutorComentario(comentarioId: number){
    return this.http.get<Profesor>(this.APIUrlComentarios+'/'+comentarioId+'/autor');
  }
  
  public publicar(publi: Publicacion) {
    return this.http.post<Publicacion>(this.APIUrlPublicaciones, publi);
  }

  public updatePublicacion(publi: Publicacion){
    return this.http.put<Publicacion>(this.APIUrlPublicaciones, publi);
  }

  public comentar(publiId: number, comentario: any){
    return this.http.post<Comentario>(this.APIUrlPublicaciones + '/' + publiId + '/comentarios', comentario);
  }

  public likePubli(publiId: number, likes){
    return this.http.patch(this.APIUrlPublicaciones + '/' + publiId, likes);
  }

  public dislikePubli(publiId: number, likes){
    return this.http.patch(this.APIUrlPublicaciones + '/' + publiId, likes);
  }

  public likeComment(comment: Comment, commentId: number){
    return this.http.put<Comentario>(this.APIUrlComentarios + '/' + commentId, comment);
  }

  public dislikeComment(commentId: number, likeId: Profesor){
    return this.http.delete(this.APIUrlComentarios + '/' + commentId + '/likes/'+likeId);
  }

  public deletePubli(id:string){
    return this.http.delete(this.APIUrlPublicaciones + '/' + id);
  }

  public deleteComment(id:string){
    return this.http.delete(this.APIUrlComentarios + '/' + id);
  }

  public deleteImgPubli(imagen: string){
    return this.http.delete(this.APIUrlImagenesPublicacion + '/files/' + imagen);
  }

  public deleteFicheroPubli(fichero :string){
    return this.http.delete(this.APIUrlFicherosPublicacion + '/files/' + fichero);
  }

  public deleteCommentsPubli(id: string){
    return this.http.delete(this.APIUrlPublicaciones + '/' + id + '/comentarios');
  }
  // public updateComentario(comentario: Comentario){
  //   return this.http.put<Comentario>(this.APIUrlComentarios, comentario);
  // }
}
