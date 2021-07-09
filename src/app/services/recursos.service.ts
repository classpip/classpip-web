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
  public verifyDataJson(typeRsc, json, imgNames, imgColName){
    console.log('typeRsc: ', typeRsc);
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
              Swal.fire('Error', 'No incluyas el campo emparejamientos en el archivo si la pregunta no es de tipo \"Emparejamiento\"').then(() => {
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
        break;
      } 
      
      case 'Avatar': {
        if(json.complemento1 != null && json.complemento2 != null && json.complemento3 != null && json.complemento4 != null
           && json.nombreComplemento1 != null && json.nombreComplemento2 != null && json.nombreComplemento3 != null && json.nombreComplemento4 != null){
            if(json.complemento1.length != 0 && json.complemento2.length != 0 && json.complemento3.length != 0 && json.complemento4.length != 0){
              
              let comps = new Array<any>();
              
              json.complemento1.forEach((c) => {
                comps.push(c);
              });

              json.complemento2.forEach((c) => {
                comps.push(c);
              });

              json.complemento3.forEach((c) => {
                comps.push(c);
              });

              json.complemento4.forEach((c) => {
                comps.push(c);
              });

              if(comps.length > 0){
                if(comps.length == imgNames.length - 1){
                  let cont = 0;
                  comps.forEach(comp => {
                    let filter = imgNames.find(file => file === comp);
                    if(filter != null){
                      cont++;
                    } else {
                      Swal.fire('Error', 'Asegúrate de seleccionar solo todas las imágenes especificadas', 'error').then(() => {
                        return false;
                      });
                    }
                  });
                  
                  if(cont == comps.length){
                    if(json.nombreFamilia != null){
                      if(json.silueta != null){
                        let filter2 = imgNames.find(file => file === json.silueta);
                        if(filter2 != null) return true;
                        else {
                          Swal.fire('Error', 'Selecciona la imagen de silueta', 'error').then(() => {
                            return false;
                          });
                        }
                      } else {
                        Swal.fire('Error', 'El campo \"silueta\" es obligatorio', 'error').then(() => {
                          return false;
                        });
                      }
                    } else {
                      Swal.fire('Error', 'El campo \"nombreFamilia\" es obligatorio', 'error').then(() => {
                        return false;
                      });
                    }
                  }

                } else {
                  Swal.fire('Error', 'Asegúrate de seleccionar todas las imágenes especificadas', 'error').then(() => {
                    return false;
                  });
                }
              }
            } else {
              Swal.fire('Error', 'Asegúrate de que los 4 complementos tienen al menos 1 imagen cada uno', 'error').then(() => {
                return false;
              });
            }
        } else {
          Swal.fire('Error', 'Asegúrate de especificar 4 complementos con su nombre y al menos 1 imagen', 'error').then(() => {
            return false;
          });
        }
        break;
      }

      case 'Imágenes de perfil': {
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
        if(imgNames.length != 0 && imgColName != null){
          if(json.nombre != null){
            if(json.imagenColeccion != null){
              if(json.imagenColeccion == imgColName){
                if(json.cromos.length >= 6){
                  if(json.dosCaras != null && (json.dosCaras != true || json.dosCaras != false)){
                    
                    let imgsCromos = new Array<string>();
                    let ready = false;
                    json.cromos.forEach(cromo => {
                      if(cromo.nombre != null){
                        if(cromo.probabilidad != null && (cromo.probabilidad == 'MUY ALTA' || cromo.probabilidad == 'ALTA' || cromo.probabilidad == 'BAJA' || cromo.probabilidad == 'MUY BAJA')){
                          if(cromo.nivel != null && (cromo.nivel == 'BRONCE' || cromo.nivel == 'PLATA' || cromo.nivel == 'ORO' || cromo.nivel == 'DIAMANTE')){
                            
                            if(!json.dosCaras){
                              if(cromo.imagenDetras == null){
                                if(cromo.imagenDelante != null){
                                  imgsCromos.push(cromo.imagenDelante);
                                  console.log('imgsCromos: '+imgsCromos.length);
                                  console.log('json cromos: '+json.cromos.length);
                                  console.log('imgNames: '+imgNames.length);
                                  if(imgsCromos.length == json.cromos.length && imgsCromos.length == imgNames.length){
                                    let cont = 0;
                                    imgsCromos.forEach(img => {
                                      let filter = imgNames.find(file => file === img);
                                      if(filter != null){
                                        cont++;
                                        if(cont == imgsCromos.length){
                                          ready = true;
                                        }
                                      } else {
                                        Swal.fire('Error','Asegúrate de seleccionar solo todas las imágenes especificadas', 'error').then(() => {
                                          return false;
                                        });
                                      }
                                    });
                                  } else if(imgsCromos.length != imgNames.length){
                                    Swal.fire('Error','Asegúrate de seleccionar todas las imágenes especificadas en los cromos', 'error').then(() => {
                                      return false;
                                    })
                                  }
                                } else {
                                  Swal.fire('Error', 'El campo \"imagenDelante\" en los cromos es obligatorio', 'error').then(() => {
                                    return false;
                                  });
                                }
                              } else {
                                Swal.fire('Error', 'El campo \"imagenDetras\" en los cromos debe ser null (sin comillas) si \"dosCaras\":false', 'error').then(() => {
                                  return false;
                                });
                              }

                            } else { //DOS CARAS = TRUE
                              if(cromo.imagenDetras != null){
                                if(cromo.imagenDelante != null){
                                  imgsCromos.push(cromo.imagenDelante, cromo.imagenDetras);
                                  if(imgsCromos.length == json.cromos.length*2 && imgsCromos.length == imgNames.length){
                                    let cont = 0;
                                    imgsCromos.forEach(img => {
                                      let filter = imgNames.find(file => file === img);
                                      if(filter != null){
                                        cont++;
                                        if(cont == imgNames.length){
                                          ready = true;
                                        }
                                      } else {
                                        console.log('el jordi es feisimo');
                                        Swal.fire('Error','Asegúrate de seleccionar solo todas las imágenes especificadas', 'error').then(() => {
                                          return false;
                                        });
                                      }
                                    });
                                  } else if(json.cromos.length*2 != imgNames.length){
                                    console.log('mis muertos pisoteaos');
                                    console.log('1',json.cromos.length);
                                    console.log('2',imgNames.length);
                                    Swal.fire('Error','Asegúrate de seleccionar todas las imágenes especificadas en los cromos', 'error').then(() => {
                                      return false;
                                    })
                                  }
                                } else {
                                  Swal.fire('Error', 'El campo \"imagenDelante\" en los cromos es obligatorio', 'error').then(() => {
                                    return false;
                                  });
                                }
                              } else {
                                Swal.fire('Error', 'El campo \"imagenDetras\" en los cromos es obligatorio si \"dosCaras\":true', 'error').then(() => {
                                  return false;
                                });
                              }
                            }
                          } else if(cromo.nivel == null){
                            Swal.fire('Error', 'El campo \"nivel\" en los cromos es obligatorio', 'error').then(() => {
                              return false;
                            });
                          } else {
                            Swal.fire('Error', 'El campo \"nivel\" en los cromos debe ser \"BRONCE\", \"PLATA\", \"ORO\" o \"DIAMANTE\"', 'error').then(() => {
                              return false;
                            });
                          }
                        } else if(cromo.probabilidad == null){
                          Swal.fire('Error', 'El campo \"probabilidad\" en los cromos es obligatorio', 'error').then(() => {
                            return false;
                          });
                        } else {
                          Swal.fire('Error', 'El campo \"probabilidad\" en los cromos debe ser \"MUY ALTA\", \"ALTA\", \"BAJA\" o \"MUY BAJA\"', 'error').then(() => {
                            return false;
                          });
                        }
                      } else {
                        Swal.fire('Error', 'El campo \"nombre\" en los cromos es obligatorio', 'error').then(() => {
                          return false;
                        });
                      }
                    });
                    
                    if(ready) return true;

                  } else {
                    Swal.fire('Error', 'El campo \"dosCaras\" es obligatorio y debe ser true o false (sin comillas)', 'error').then(() => {
                      return false;
                    });
                  }
                } else {
                  Swal.fire('Error','Introduce al menos 6 cromos', 'error').then(() => {
                    return false;
                  });
                }
              } else {
                Swal.fire('Error', 'El campo \"imagenColeccion\" no coincide con la imagen seleccionada', 'error').then(() => {
                  return false;
                });
              }
            } else {
              Swal.fire('Error', 'El campo \"imagenColeccion\" es obligatorio', 'error').then(() => {
                return false;
              });
            }
          } else {
            Swal.fire('Error', 'El campo \"nombre\" es obligatorio', 'error').then(() => {
              return false;
            });
          }
        } else if(imgColName == null){
          Swal.fire('Error', 'Selecciona la imagen de la colección', 'error').then(() => {
            return false;
          });
        } else if(imgNames.length == 0){
          Swal.fire('Error', 'Selecciona las imágenes especificadas para los cromos', 'error').then(() => {
            return false;
          });
        }
        break;
      }
    }
  }
}
