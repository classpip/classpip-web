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

  private APIUrlPreguntas = this.host + ':3000/api/Preguntas';

  constructor(
    private http: HttpClient,
    
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
    return this.http.get<FamiliaDeImagenesDePerfil[]>(this.APIUrlFamiliasDeImagenesDePerfil
      + '?filter[where][Publica]=true');
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
  

  //NO FUNCIONA
   public DameImagenAvatar(imagen: string): Observable<any> {
    return this.http.get(this.APIUrlImagenesAvatares + '/download/' + imagen,
    { headers: new HttpHeaders({
      'Content-Type': 'application/octet-stream',
        }), responseType: 'blob'}
      /* {responseType: ResponseContentType.Blob} */);
      /* return this.http.get(url, { headers: new HttpHeaders({
        'Authorization': 'Basic ' + encodedAuth,
        'Content-Type': 'application/octet-stream',
        }), responseType: 'blob'}) */
  } 

  

  
}
