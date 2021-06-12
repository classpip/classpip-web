import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { FamiliaAvatares } from '../clases/recursos/FamiliaAvatares';
import * as environment from './../../environments/environment';
import { Profesor } from '../clases/Profesor';
import { Cuestionario } from '../clases/recursos/Cuestionario';
import { CuestionarioSatisfaccion } from '../clases/recursos/CuestionarioSatisfaccion';
import { FamiliaDeImagenesDePerfil } from '../clases/recursos/FamiliaDeImagenesDePerfil';
import { Coleccion } from '../clases/recursos/Coleccion';
import { Pregunta } from '../clases/recursos/Pregunta';
import { Cromo } from '../clases/recursos/Cromo';
import { Http, ResponseContentType } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class RecursosService {

  private host = environment.host;

  private APIUrlProfesores = this.host + ':3000/api/Profesores';

  //URLS RECURSOS
  private APIUrlFamiliarAvatares = this.host + ':3000/api/familiasAvatares';
  private APIUrlCuestionariosSatisfaccion = this.host + ':3000/api/cuestionariosSatisfaccion';
  private APIUrlCuestionarios = this.host + ':3000/api/Cuestionarios';
  private APIUrlFamiliasDeImagenesDePerfil = this.host + ':3000/api/familiasImagenesPerfil';
  private APIUrlColecciones = this.host + ':3000/api/Colecciones';

  //URLS IMAGENES
  private APIUrlImagenes = this.host + ':3000/api/imagenes';
  private APIUrlImagenesAvatares = this.host + ':3000/api/imagenes/ImagenesAvatares';
  private APIUrlImagenesCromos = this.host + ':3000/api/imagenes/ImagenCromo';
  private APIUrlImagenesColecciones = this.host + ':3000/api/imagenes/ImagenColeccion';
  private APIUrlImagenesPerfil = this.host + ':3000/api/imagenes/ImagenesPerfil';
  private APIUrlImagenesPreguntas = this.host + ':3000/api/imagenes/ImagenesPreguntas';

  // private APIUrlImagenesAvatares = this.host + ':3000/api/imagenes/ImagenesAvatares';

  private APIUrlPreguntas = this.host + ':3000/api/Preguntas';

  constructor(
    private http: HttpClient,
    private httpImagenes: Http
    ) { }


  /*****************************************************/
  ///********* SERVICIOS OBTENER RECURSOS ************///
  /*****************************************************/

  //Método para obtener los profesores y mostrar el nombre del propietario
  public DameProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.APIUrlProfesores);
  }

  //FAMILIAS AVATARES
  public DameFamiliasAvataresPublicas(): Observable<FamiliaAvatares[]> {
    return this.http.get<FamiliaAvatares[]>(this.APIUrlFamiliarAvatares);
  }

  //FAMILIAS IMÁGENES PERFIL
  public DameFamiliasDeImagenesDePerfilPublicas(): Observable<FamiliaDeImagenesDePerfil[]> {
    return this.http.get<FamiliaDeImagenesDePerfil[]>(this.APIUrlFamiliasDeImagenesDePerfil);
  }

  //COLECCIONES
  public DameColeccionesPublicas(): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.APIUrlColecciones);
  }

  //CROMOS
  public DameCromosColeccion(coleccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlColecciones + '/' + coleccionId + '/cromos');
  }

  //PREGUNTAS
  public DamePreguntas(): Observable<Pregunta[]>{
    return this.http.get<Pregunta[]>(this.APIUrlPreguntas);
  }
  
  // public DameCuestionariosPublicos(): Observable<Cuestionario[]> {
  //   return this.http.get<Cuestionario[]>(this.APIUrlCuestionarios);
  // }

  // public DamePreguntasCuestionario(cuestionarioId: number): Observable<Pregunta[]> {
  //   return this.http.get<Pregunta[]>(this.APIUrlCuestionarios + '/' + cuestionarioId + '/Preguntas');
  // }

  // public DameCuestionariosSatisfaccionPublicos(): Observable<CuestionarioSatisfaccion[]> {
  //   return this.http.get<CuestionarioSatisfaccion[]>(this.APIUrlCuestionariosSatisfaccion);
  // }

  /*****************************************************/
  ///*********** SERVICIOS BORRAR RECURSOS ************///
  /*****************************************************/
  public deletePregunta(id: string){
    return this.http.delete(this.APIUrlPreguntas + '/' + id);
  }

  public deleteColeccion(id: string){
    return this.http.delete(this.APIUrlColecciones + '/' +  id);
  }

  public deleteImagenColeccion(imagen: string){
    return this.http.delete(this.APIUrlImagenesColecciones + '/files/' + imagen);
  }

  public deleteCromos(coleccionId: string){
    return this.http.delete(this.APIUrlColecciones + '/' + coleccionId + '/cromos');
  }

  public deleteImagenCromo(imagen:string){
    return this.http.delete(this.APIUrlImagenesCromos + '/files/' + imagen)
  }

  public deleteFamiliaAvatares(id: string){
    return this.http.delete(this.APIUrlFamiliarAvatares + '/' + id);
  }

  public deleteImagenesAvatares(imagen: string){
    return this.http.delete(this.APIUrlImagenesAvatares + '/files/' + imagen)
  }

  public deleteFamiliaImagenesPerfil(id: string){
    return this.http.delete(this.APIUrlFamiliasDeImagenesDePerfil + '/' + id);
  }

  public deleteImagenPerfil(imagen: string){
    return this.http.delete(this.APIUrlImagenesPerfil + '/files/' + imagen)
  }

  public deleteImagenPregunta(imagen:string){
    return this.http.delete(this.APIUrlImagenesPreguntas + '/files/' + imagen)
  }

  /*****************************************************/
  ///*********** SERVICIOS SUBIR RECURSOS ************///
  /*****************************************************/

  public uploadPregunta(pregunta: Pregunta){
    return this.http.post(this.APIUrlPreguntas, pregunta, /* headers */);
  }

  public uploadFamiliaAvatar(avatar: FamiliaAvatares){
    return this.http.post(this.APIUrlFamiliarAvatares, avatar);
  }

  public uploadFamiliaImgPerfil(familia: FamiliaDeImagenesDePerfil){
    return this.http.post(this.APIUrlFamiliasDeImagenesDePerfil, familia);
  }

  public uploadColeccion(coleccion: Coleccion){
    return this.http.post(this.APIUrlColecciones, coleccion);
  }

  public uploadCromos(cromo: Cromo){
    return this.http.post(this.APIUrlColecciones + '/' + cromo.coleccionId + '/cromos', cromo);
  }
}
