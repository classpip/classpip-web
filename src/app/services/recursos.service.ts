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

  private APIUrlFamiliarAvatares = this.host + ':3000/api/familiasAvatares';
  private APIUrlCuestionariosSatisfaccion = this.host + ':3000/api/cuestionariosSatisfaccion';
  private APIUrlCuestionarios = this.host + ':3000/api/Cuestionarios';
  private APIUrlFamiliasDeImagenesDePerfil = this.host + ':3000/api/familiasImagenesPerfil';
  private APIUrlColecciones = this.host + ':3000/api/Colecciones';

  private APIUrlImagenesAvatares = this.host + ':3000/api/imagenes/ImagenesAvatares';
  private APIUrlImagenesCromos = this.host + ':3000/api/imagenes/ImagenCromo';
  private APIUrlImagenesColecciones = this.host + ':3000/api/imagenes/ImagenColeccion';
  private APIUrlImagenesPerfil = this.host + ':3000/api/imagenes/ImagenesPerfil';
  private APIUrlImagenesPreguntas = this.host + ':3000/api/imagenes/ImagenesPreguntas';


  private APIUrlPreguntas = this.host + ':3000/api/Preguntas';

  constructor(
    private http: HttpClient,
    private httpImagenes: Http
    
    ) { }

  public DameProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.APIUrlProfesores);
  }

  public DameFamiliasAvataresPublicas(): Observable<FamiliaAvatares[]> {
    console.log(this.APIUrlFamiliarAvatares + '?filter[where][Publica]=true')
    return this.http.get<FamiliaAvatares[]>(this.APIUrlFamiliarAvatares
      + '?filter[where][Publica]=true');
  }

  public DameCuestionariosPublicos(): Observable<Cuestionario[]> {
    return this.http.get<Cuestionario[]>(this.APIUrlCuestionarios
      + '?filter[where][Publico]=true');
  }

  public DameCuestionariosSatisfaccionPublicos(): Observable<CuestionarioSatisfaccion[]> {
    return this.http.get<CuestionarioSatisfaccion[]>(this.APIUrlCuestionariosSatisfaccion
      + '?filter[where][Publico]=true');
  }

  public DameFamiliasDeImagenesDePerfilPublicas(): Observable<FamiliaDeImagenesDePerfil[]> {
    return this.http.get<FamiliaDeImagenesDePerfil[]>(this.APIUrlFamiliasDeImagenesDePerfil);
  }

  public DameColeccionesPublicas(): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.APIUrlColecciones
      + '?filter[where][Publica]=true');
  }

  public DamePreguntasCuestionario(cuestionarioId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.APIUrlCuestionarios + '/' + cuestionarioId + '/Preguntas');
  }

  public DameCromosColeccion(coleccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlColecciones + '/' + coleccionId + '/cromos');
  }

  public DamePreguntas(): Observable<Pregunta[]>{
    return this.http.get<Pregunta[]>(this.APIUrlPreguntas);
  }

  /*****************************************************/
  // ************* SERVICIOS IMAGENES ***************///
  /*****************************************************/

  /************ DOWNLOAD **************/
  public downloadImgCromo(imgName: string) {
    return this.http.get(this.APIUrlImagenesCromos + '/download/'+imgName, {observe: 'body', responseType: 'blob'});
  }

  public downloadImgColeccion(imgName: string) {
    return this.http.get(this.APIUrlImagenesColecciones + '/download/' + imgName, {observe: 'body', responseType: 'blob'});
  }

  public downloadImgSilueta(imgName: string) {
    return this.http.get(this.APIUrlImagenesAvatares + '/download/' + imgName, {observe: 'body', responseType: 'blob'});
    
  }

  public downloadImgComplementoAvatar(imgName: string) {
    return this.http.get(this.APIUrlImagenesAvatares + '/download/' + imgName, {observe: 'body', responseType: 'blob'});
  }

  public downloadImgPerfil(imgName: string) {
    return this.http.get(imgName, {observe: 'body', responseType: 'blob'});
  }

  public downloadImgPregunta(imgName: string){  
    console.log(this.APIUrlImagenesPreguntas + '/download/'+ imgName);  
    return this.http.get(this.APIUrlImagenesPreguntas + '/download/' + imgName, {observe: 'body', responseType: 'blob'});
    
  }

  ///SERVICIOS BORRAR RECURSOS
  public deletePregunta(id: string){
    return this.http.delete(this.APIUrlPreguntas + '/' + id);
  }

  public deleteColeccion(id: string){
    return this.http.delete(this.APIUrlColecciones + '/' + id);
  }

  public deleteFamiliaAvatares(id: string){
    return this.http.delete(this.APIUrlFamiliarAvatares + '/' + id);
  }

  public deleteFamiliaImagenesPerfil(id: string){
    return this.http.delete(this.APIUrlFamiliasDeImagenesDePerfil + '/' + id);
  }

  ///SERVICIOS SUBIR RECURSOS
  /************ UPLOAD **************/

  public uploadImgPregunta(imgPregunta){
    return this.http.post('http://localhost:3000/api/imagenes/ImagenesPreguntas/upload', imgPregunta);
  }

  /*****************************************************/
  ///*********** SERVICIOS SUBIR RECURSOS ************///
  /*****************************************************/

  public uploadPregunta(pregunta: Pregunta){
    return this.http.post(this.APIUrlPreguntas, pregunta);
  }

  

  //NO FUNCIONA
   public DameImagenAvatar(imagen: string): Observable<any> {
     console.log("esta es la imagen: ", imagen)
    return this.http.get(this.APIUrlImagenesAvatares + '/download/' + imagen,    
        {observe: 'body', responseType: 'blob'});
      /* {responseType: ResponseContentType.Blob} );*/
      /* return this.http.get(url, { headers: new HttpHeaders({
        'Authorization': 'Basic ' + encodedAuth,
        'Content-Type': 'application/octet-stream',
        }), responseType: 'blob'}) */
        /* { headers: new HttpHeaders({
      'Content-Type': 'application/octet-stream',
        }), responseType: 'blob'} */
  } 

  

  
}
