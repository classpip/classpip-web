import { Profesor } from './../clases/Profesor';
import { Publicacion } from './../clases/Publicacion';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as environment from './../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../clases/User';
import { Comentario } from '../clases/Comentario';
import {tap} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private host = environment.host;

  //Usuarios
  private APIUrlUsers = this.host + ':3000/api/Users';
  private APIUrlProfesores = this.host + ':3000/api/Profesores';
  private APIUrlPublicaciones = this.host + ':3000/api/Publicaciones';
  private APIUrlComentarios = this.host + ':3000/api/Comentarios';

  constructor(private http: HttpClient, auth: AuthService) { }

  public damePublicaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrlPublicaciones + '?filter[include]=likes&filter[include]=autor');
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

  public likePubli(publiId: number, profesor: Profesor){
    return this.http.post(this.APIUrlPublicaciones + '/' + publiId + '/likes', profesor);
  }

  public dislikePubli(publiId: number, likeId: Profesor){
    return this.http.delete(this.APIUrlPublicaciones + '/' + publiId + '/likes/'+likeId);
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
  // public updateComentario(comentario: Comentario){
  //   return this.http.put<Comentario>(this.APIUrlComentarios, comentario);
  // }
}
