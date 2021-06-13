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
import Swal from 'sweetalert2';


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

  ///////// FUNCIONES COMPROBAR RECURSOS ////////////
  public verifyDataJson(typeRsc, json, imgNames){
    switch(typeRsc){
      case 'Pregunta': {
        if((json.imagen != null && json.imagen == imgNames[0]) || (json.imagen == null && imgNames[0] == null)){
          if(json.titulo == null){
            Swal.fire('Error', 'El título debe estar relleno', 'error').then(() => {
              return false;
            });
          } else if(json.tematica == null){
            Swal.fire('Error', 'La temática debe estar rellena', 'error').then(() => {
              return false;
            });
          } else if(json.feedbackCorrecto == null){
            Swal.fire('Error', 'Feedback correcto debe estar relleno', 'error').then(() => {
              return false;
            });
          } else if(json.feedbackIncorrecto == null){
            Swal.fire('Error', 'Feedback incorrecto debe estar relleno', 'error').then(() => {
              return false;
            });
          } else if(json.pregunta == null){
            Swal.fire('Error', 'La pregunta debe estar rellena', 'error').then(() => {
              return false;
            });
          } else if(json.tipo == null){
            Swal.fire('Error', 'El tipo debe estar relleno', 'error').then(() => {
              return false;
            });
          } else {
            if(json.tipo != 'Emparejamiento' && json.emparejamientos != null){
              Swal.fire('Error', 'No includas el campo emparejamientos en el archivo si la pregunta no es de tipo \"Emparejamiento\"').then(() => {
                return false;
              })
            } else {
              if(json.tipo == 'Respuesta abierta'){
                if(json.respuestaCorrecta == null){
                  Swal.fire('Error', 'La respuesta correcta debe estar rellena', 'error').then(() => {
                    return false;
                  });
                } else return true;
              } else if(json.tipo == 'Emparejamiento'){
                if(json.emparejamientos != null && json.emparejamientos.length > 0){
                  json.emparejamientos.forEach(pareja => {
                    if(pareja.l == null || pareja.r == null){
                      Swal.fire('Error', 'Emparejamientos incorrectos', 'error').then(() => {
                        return false;
                      })
                    }
                  })
                  return true;
                }
                else {
                  Swal.fire('Error', 'Emparejamientos incorrectos.', 'error').then(() => {
                    return false;
                  });
                }
              } else if(json.tipo == 'Verdadero o falso'){
                if(json.respuestaCorrecta == null || (json.respuestaCorrecta != true && json.respuestaCorrecta != false)){
                  Swal.fire('Error', 'La respuesta correcta debe ser true o false', 'error').then(() => {
                    return false;
                  });
                } else return true;
              } else if(json.tipo == 'Cuatro opciones'){
                if(json.respuestaCorrecta == null || json.respuestaIncorrecta1 == null ||
                  json.respuestaIncorrecta2 == null || json.respuestaIncorrecta3 == null){
                    Swal.fire('Error', 'Rellena la respuesta correcta y las 3 incorrectas', 'error').then(()=>{
                      return false
                    });
                } else return true;
              } else {
                Swal.fire('Error', 'Tipo de pregunta incompatible', 'error').then(() => {
                  return false;
                });
              }
            }
          }
        } 
        else if(json.imagen != null && json.imagen != imgNames[0]){
          Swal.fire('Error', 'Selecciona la imagen correspondiente al campo \"imagen\" del archivo','error').then(() => {
            return false;
          });
        } 
        else if(json.imagen == null && imgNames != null){
          Swal.fire('Error', 'El archivo no contiene el campo imagen', 'error').then(() => {
            return false;
          });
        }
      } 
      
      case 'Avatar': {
        console.log('falta desarrollar verify avatar');
        return true;
        break;
      }

      case 'Imágenes de perfil': {
        console.log('verify json: '+json.imagenes);
        console.log('verify json imgs: '+imgNames);
        if(json.imagenes != null && json.imagenes.length > 0){
          if(imgNames.length == json.imagenes.length && imgNames.length == json.numeroImagenes){

            if(json.numeroImagenes == json.imagenes.length){

              if(json.nombreFamilia == null){
                Swal.fire('Error','El campo \"nombreFamilia\" debe especificarse en el fichero JSON', 'error').then(() => {
                  return false;
                });
              } else {
                let cont = 0;
                json.imagenes.forEach((img) => {
                  let filter = imgNames.find(file => file === img);
                  if(filter != null){
                    cont++;
                  } else {
                    Swal.fire('Error','Asegúrate de seleccionar solo todas las imágenes especificadas en el campo \"imagenes\"', 'error').then(() => {
                      return false;
                    });
                  }
                  console.log('cont verify: ', cont, json.imagenes.length);
                });
                if(cont == json.imagenes.length){
                  console.log('entra return');
                  return true;
                }
              }
  
            } else {
              Swal.fire('Error', 'El campo \"numeroImagenes\" no coincide con la cantidad de imagenes especificadas.', 'error').then(()=>{
                return false;
              });
            }
          
          } else if(imgNames.length == 0){
            Swal.fire('Error','Selecciona las imágenes correspondientes.','error').then(() => {
              return false;
            });
          } else if(imgNames.length != json.imagenes.length){
            Swal.fire('Error','El nº de imágenes seleccionadas no coincide con las especificadas', 'error').then(() => {
              return false;
            });
          } else if(imgNames.length != json.numeroImagenes){
            Swal.fire('Error','El nº de imágenes seleccionadas no coincide con el campo \"numeroImagenes\"', 'error').then(() => {
              return false;
            });
          }
        } else {
          if(json.imagenes != null && json.imagenes.length == 0){
            Swal.fire('Error','Introduce los nombres de las imágenes a subir en el campo \"imagenes\".','error').then(() => {
              return false;
            })
          } else if(json.imagenes == null){
            Swal.fire('Error','El archivo JSON no contiene el campo \"imagenes\".','error').then(()=>{
              return false;
            })
          }
        }
        break;
      }

      case 'Colección': {
        console.log('falta desarrollar verify coleccion');
        return true;
        break;
      }
    }
  }
}
