import { ImagenesService } from './../../services/imagenes.service';
import { Pregunta } from 'src/app/clases/recursos/Pregunta';
import { FamiliaDeImagenesDePerfil } from 'src/app/clases/recursos/FamiliaDeImagenesDePerfil';
import { saveAs } from 'file-saver';
import { SesionService } from 'src/app/services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { RecursosService } from './../../services/recursos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { FamiliaAvatares } from 'src/app/clases/recursos/FamiliaAvatares';
import { Cuestionario } from 'src/app/clases/recursos/Cuestionario';
import { Coleccion } from 'src/app/clases/recursos/Coleccion';
import * as URL from 'src/app/URLs/urls'
import * as JSZip from 'jszip';
import { Cromo } from 'src/app/clases/recursos/Cromo';
import Swal from 'sweetalert2';
import { Console } from 'console';
import { forEach } from 'jszip';

@Component({
  selector: 'app-recursos-list',
  templateUrl: './recursos-list.component.html',
  styleUrls: ['./recursos-list.component.scss']
})
export class RecursosListComponent implements OnInit {

  recurso: String;
  rscName: String;
  listRecursos;
  mapProfesores: Map<Number, Profesor> = new Map();
  profesor;

  index;


  //Recursos
  cuestionario: Cuestionario;
  coleccion: any;
  familia: FamiliaAvatares;
  listaFamiliasPublicas: any[] = [];
  cromosColeccion: Cromo[];

  interval;
  urlImagenesPerfil = URL.ImagenesPerfil;
  urlImagenesPreguntas = URL.ImagenesPregunta;

  //Variables para filtrar preguntas
  isFilter = false;
  mapPreguntasTipo = new Map<string, Array<any>>();
  mapPreguntasTematica = new Map<string, Array<any>>();
  listTipo;
  listTematica;
  backup = null;
  pregunta;

  

  //variables descargas
  listDescargasPreguntas = new Array<Pregunta>();
  isDownloading = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private recursosService: RecursosService,
    private imagenesService: ImagenesService,
    private sesion: SesionService
  ) { }

  ngOnInit(): void {
    //Obtiene de la ruta el tipo de recurso que es
    this.recurso = this.activeRoute.snapshot.params.recurso;

    //Obtiene los profesores para poder obtener el nombre del propietario
    //Lo hace en caso de que este logueado, sino no verá los propietarios
    if (this.isLoggedIn()) {
      this.profesor = this.sesion.DameProfesor();
      this.recursosService.DameProfesores().subscribe(profesores => {
        profesores.forEach(prof => {
          this.mapProfesores.set(prof.id, prof);
        });
      });
    }

    //Carga los recursos correspondientes en la lista de recursos que se muestra
    //He puesto ya los casos para todos los recursos. Falta mirar aver si hay que quitar alguno
    switch (this.recurso) {
      case 'avatares': {
        this.rscName = 'Avatares';
        this.DameFamiliasDeAvataresPublicas();
        break;
      }

      case 'preguntas': {
        this.rscName = 'Preguntas';
        this.DameTodasPreguntas();
        break;
      }

      case 'colecciones': {
        this.rscName = 'Colecciones';
        this.DameColecciones();

        break;
      }

      case 'imagenes': {
        this.rscName = 'Imágenes de perfil';
        this.DameFamiliasImagenesPerfil();
        break;
      }

      // case 'cuestionarios': {
      //   this.rscName = 'Cuestionarios';
      //   this.DameCuestionariosPublicos();
      //   break;
      // }

      // case 'rubricas': {
      //   this.rscName = 'Rúbricas';
      //   this.listRecursos = [];
      //   break;
      // }

      // case 'satisfaccion': {
      //   this.rscName = 'Cuestionarios de Satisfacción';
      //   this.DameCuestionariosSatisfaccionPublicos();
      //   break;
      // }

      // case 'puntos': {
      //   this.rscName = 'Puntos';
      //   this.listRecursos = [];
      //   break;
      // }

      // case 'escenarios': {
      //   this.rscName = 'Escenarios';
      //   this.listRecursos = [];
      //   break;
      // }
    }
  }

  isLoggedIn() {
    if (sessionStorage.getItem('ACCESS_TOKEN') != null) return true;
    else return false;
  }

  // Funciones para recursos de tipo imágenes de perfil
  isImagenes() {
    if (this.recurso == 'imagenes')
      return true;


    else return false;
  }

  // Funciones para recursos de tipo pregunta
  isPreguntas() {
    if (this.recurso == 'preguntas')
      return true;

    else return false;
  }

  //Función para ver si soy el propietario del recurso
  isPropietario(recurso) {
    console.log("this.prof: ", this.profesor.id);
    console.log("recurso.prof: ", recurso.profesorId);
    if (this.profesor.id == recurso.profesorId) {

      return true
    }
    else {

      return false
    }

  }

  filter() {

    let auxMap = new Map();

    let tipo = (<HTMLInputElement>document.getElementById("tipo")).value;

    let tematica = (<HTMLInputElement>document.getElementById("tematica")).value;

    if (tipo == 'Ninguno' && tematica == 'Ninguno') {
      // Swal.fire('Error', 'Selecciona algún filtro', 'error');
      console.log('No hay filtros seleccionados');
    } else {

      if (this.backup == null) {
        this.backup = this.listRecursos;
      }
      this.listRecursos = [];
      console.log('backup: ', this.backup)

      if (tematica != 'Ninguno' && tipo == 'Ninguno') {
        console.log('Filtramos por tematica ', tematica);
        this.mapPreguntasTematica.get(tematica).forEach(rsc => {
          if (!auxMap.has(rsc.id))
            auxMap.set(rsc.id, rsc);
        });
        console.log('list tematica: ', auxMap.values());
      }

      else if (tematica == 'Ninguno' && tipo != 'Ninguno') {
        console.log('Filtramos por tipo ', tipo);
        this.mapPreguntasTipo.get(tipo).forEach(rsc => {
          if (!auxMap.has(rsc.id))
            auxMap.set(rsc.id, rsc);
        });
        console.log('list tipo: ', auxMap.values());
      }

      else {
        console.log('Filtramos por ' + tipo + ' y ' + tematica);
        let auxType = this.mapPreguntasTipo.get(tipo);
        this.mapPreguntasTematica.get(tematica).forEach(rscTem => {
          auxType.forEach(rscType => {
            if (rscTem.id == rscType.id) {
              auxMap.set(rscType.id, rscType);
            }
          })
        });
      }

      if (auxMap.size != 0) {
        console.log('auxMap: ', auxMap);
        this.listRecursos = Array.from(auxMap.values());
        console.log('lista filtrada: ', this.listRecursos);
        this.isFilter = true;
      } else {
        Swal.fire('Error', 'No hay coincidencias', 'error');
        this.clearFilters();
      }

    }
  }

  clearFilters() {
    (<HTMLInputElement>document.getElementById("tipo")).value = 'Ninguno';
    (<HTMLInputElement>document.getElementById("tematica")).value = 'Ninguno';
    this.isFilter = false;
    this.listRecursos = this.backup;
    this.backup = null;
  }

  verPregunta(rsc: any) {
    this.pregunta = rsc;
    console.log("pregunta: ", rsc)
  }

  // Función para volver a la página de recursos
  volver() {
    this.router.navigateByUrl('/recursos');
  }

  /*********************************************/
  /*FUNCIONES PARA OBTENER LA LISTA DE RECURSOS*/
  /*********************************************/


  //Funcion que obtiene los recursos publicos de avatares
  DameFamiliasDeAvataresPublicas() {
    this.recursosService.DameFamiliasAvataresPublicas().subscribe((res) => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if (this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).primerApellido;

          } else {
            recurso.propietario = 'Desconocido';
          }
          //Comprueba si soy el propietario
          if (this.profesor != undefined) {
            recurso.isPropietario = this.isPropietario(recurso);
          }

        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['nombreFamilia']; // Assign new key
          //delete obj['NombreFamilia']; // Delete old key
          return obj;
        });
      }
    },
      (error) => {
        console.log(error);
        this.listRecursos = [];
      });
  }

  //Funcion que obtiene los recursos publicos de cuestionarios
  // DameCuestionariosPublicos() {
  //   this.recursosService.DameCuestionariosPublicos().subscribe(res => {
  //     console.log(res);
  //     if (res !== undefined) {
  //       //Carga los recursos en la lista
  //       this.listRecursos = res;

  //       //Cambia el profesorId por su nombre
  //       this.listRecursos.forEach(recurso => {
  //         console.log("Holi este es el id:", recurso.id)
  //         if (this.mapProfesores.has(recurso.profesorId)) {
  //           recurso.propietario = this.mapProfesores.get(recurso.profesorId).nombre + ' ';
  //           recurso.propietario += this.mapProfesores.get(recurso.profesorId).primerApellido;
  //         } else {
  //           recurso.propietario = 'Desconocido';
  //         }

  //       });
  //       //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
  //       this.listRecursos = this.listRecursos.map(function (obj) {
  //         obj['nombreRecurso'] = obj['titulo']; // Assign new key
  //         //delete obj['Titulo']; // Delete old key
  //         return obj;
  //       });
  //     }
  //   },
  //     (error) => {
  //       console.log(error);
  //       this.listRecursos = [];
  //     });
  // }

  //Funcion que obtiene los recursos publicos de cuestionarios de satisfaccion
  // DameCuestionariosSatisfaccionPublicos() {
  //   this.recursosService.DameCuestionariosPublicos().subscribe(res => {
  //     console.log(res);
  //     if (res !== undefined) {
  //       //Carga los recursos en la lista
  //       this.listRecursos = res;

  //       //Cambia el profesorId por su nombre
  //       this.listRecursos.forEach(recurso => {
  //         if (this.mapProfesores.has(recurso.profesorId)) {
  //           recurso.propietario = this.mapProfesores.get(recurso.profesorId).nombre + ' ';
  //           recurso.propietario += this.mapProfesores.get(recurso.profesorId).primerApellido;
  //         } else {
  //           recurso.propietario = 'Desconocido';
  //         }

  //       });
  //       //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
  //       this.listRecursos = this.listRecursos.map(function (obj) {
  //         obj['nombreRecurso'] = obj['titulo']; // Assign new key
  //         //delete obj['Titulo']; // Delete old key
  //         return obj;
  //       });
  //     }
  //   },
  //     (error) => {
  //       console.log(error);
  //       this.listRecursos = [];
  //     });
  // }

  //Funcion que obtiene los recursos publicos de imaganes de perfil
  DameFamiliasImagenesPerfil() {
    this.recursosService.DameFamiliasDeImagenesDePerfilPublicas().subscribe(res => {
      console.log("Esto es:", res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {

          if (this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).primerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
          //Comprueba si soy el propietario
          if (this.profesor != undefined) {
            recurso.isPropietario = this.isPropietario(recurso);
          }

        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['nombreFamilia']; // Assign new key
          obj['ejemplos'] = obj['imagenes'];
          //delete obj['NombreFamilia']; // Delete old key
          return obj;
        });

        //Carga las fotos de ejemplo
        /* this.listRecursos.forEach(recurso => {
          for (let i = 0; i < recurso.ejemplos.length; i++) {
            recurso.ejemplos[i] = URL.ImagenesPerfil + recurso.ejemplos[i];
          }
        }); */
      }

    },
      (error) => {
        console.log(error);
        this.listRecursos = [];
      });
  }

  //Funcion que obtiene los recursos publicos de colecciones
  DameColecciones() {
    this.recursosService.DameColeccionesPublicas().subscribe(res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if (this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).primerApellido;

          } else {
            recurso.propietario = 'Desconocido';
          }
          //Comprueba si soy el propietario
          if (this.profesor != undefined) {
            recurso.isPropietario = this.isPropietario(recurso);
          }


        });
        console.log("ESTE: ", this.listRecursos)
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['nombre']; // Assign new key
          //delete obj['Nombre']; // Delete old key
          return obj;
        });
      }
    },
      (error) => {
        console.log(error);
        this.listRecursos = [];
      });
  }

  DameTodasPreguntas() {
    this.recursosService.DamePreguntas().subscribe(res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['titulo']; // Assign new key
          //delete obj['NombreFamilia']; // Delete old key
          return obj;
        });

        this.mapPreguntasTipo.set('Ninguno', null);
        this.mapPreguntasTematica.set('Ninguno', null);
        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if (this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).primerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
          //Comprueba si soy el propietario
          if (this.profesor != undefined) {
            recurso.isPropietario = this.isPropietario(recurso);
          }

          if (recurso.tipo != null) {
            if (!this.mapPreguntasTipo.has(recurso.tipo)) {
              this.mapPreguntasTipo.set(recurso.tipo, new Array());
            }
            this.mapPreguntasTipo.get(recurso.tipo).push(recurso);
          };

          if (recurso.tematica != null) {
            if (!this.mapPreguntasTematica.has(recurso.tematica)) {
              this.mapPreguntasTematica.set(recurso.tematica, new Array());
            }
            this.mapPreguntasTematica.get(recurso.tematica).push(recurso);
          };
          
        });

        if (this.mapPreguntasTipo.size != 0) this.listTipo = Array.from(this.mapPreguntasTipo.keys());
        if (this.mapPreguntasTematica.size != 0) this.listTematica = Array.from(this.mapPreguntasTematica.keys());

        console.log('tipo: ', this.listTipo);
        console.log('tematica: ', this.listTematica);
      }
    },
      (error) => {
        console.log(error);
        this.listRecursos = [];
      });
  }

  /*************************************/
  /* FUNCIONES PARA VISUALIZAR RECURSOS */
  /*************************************/

  //Envia los datos del cuestionario a la pagina que lo muestra
  EnviaCuestionario(cuestionario: Cuestionario) {
    this.sesion.TomaCuestionario(cuestionario);
    console.log(cuestionario);

  }

  //Envia los datos de la coleccion a la pagina que la muestra
  EnviaColeccion(coleccion: Coleccion) {
    this.sesion.TomaColeccion(coleccion);
    console.log("Toma coleccion: ", coleccion);


  }

  //Envia los datos de la familia de avatares a la pagina que la muestra
  EnviaFamiliaAvatares(familia: FamiliaAvatares) {
    this.sesion.TomaFamilia(familia);
    console.log(familia);

  }


  EnviaRecurso(rsc) {
    switch (this.recurso) {
      case 'cuestionarios': {
        this.EnviaCuestionario(rsc);
        break;
      }
      case 'colecciones': {
        this.EnviaColeccion(rsc);
        break;
      }
      case 'avatares': {
        this.EnviaFamiliaAvatares(rsc);
        break;
      }
    }
  }

  /*************************************/
  /* FUNCIONES PARA DESCARGAR RECURSOS */
  /*************************************/

  descargarRecurso(rsc) {
    switch (this.recurso) {
      case 'cuestionarios': {
        //this.DescargaCuestionario(rsc);
        break;
      }
      case 'colecciones': {
        this.descargaColeccion(rsc);
        break;
      }
      case 'avatares': {
        this.descargaFamiliaAvatares(rsc);
        break;
      }
      case 'imagenes': {
        this.descargaFamiliaImagenes(rsc);
        break;
      }
      case 'preguntas': {
        this.descargaPreguntas(rsc);
        break;
      }
    }
  }

  mapCheckPreguntas = new Map<number,Pregunta>();

  //Función para seleccionar varios recursos a descargar
  isSelected($event, index: number, rsc: Pregunta) {
    if(this.mapCheckPreguntas.has(index)){
      this.mapCheckPreguntas.delete(index)
    }
    else{
      this.mapCheckPreguntas.set(index,rsc);
    }
    console.log("check:", this.mapCheckPreguntas);
    console.log("event:", $event.checked)
  }

  //Función para descargar la colección
  descargaColeccion(rsc: Coleccion) {

    this.isDownloading = true;

    //Prepara el fichero ZIP a descargar
    let zip = new JSZip();
    let folder = zip.folder('imagenes');

    //Guarda los datos de la coleccion a guardar
    this.coleccion = {
      nombre: rsc.nombre,
      imagenColeccion: rsc.imagenColeccion,
      dosCaras: rsc.dosCaras,
      cromos: []
    };

    //Obtiene los cromos de la coleccion
    this.recursosService.DameCromosColeccion(rsc.id).subscribe(cromos => {
      //Itera los cromos para obtener sus datos
      cromos.forEach(cromo => {
        const c = {
          nombreCromo: cromo.nombre,
          nombreImagenCromoDelante: cromo.imagenDelante,
          nombreImagenCromoDetras: cromo.imagenDetras,
          nivelCromo: cromo.nivel,
          probabilidadCromo: cromo.probabilidad,
        };
        //Guarda los cromos en la coleccion
        this.coleccion.cromos.push(c);
      });

      console.log("Coleccion a descargar: ", this.coleccion);

      //Crea el fichero JSON de la coleccion y lo añade al ZIP
      const theJSON = JSON.stringify(this.coleccion);
      zip.file(rsc.nombre + ".json", theJSON);

      //Descarga la imagen de la coleccion y la añade al ZIP
      this.imagenesService.downloadImgColeccion(rsc.imagenColeccion).subscribe((data: any) => {
        folder.file(`${rsc.imagenColeccion}`, data);
      });

      console.log(this.coleccion.cromos);
      //Obtiene los nombres de las imagenes de los cromos de la colección
      let imgNames: string[] = [];
      this.coleccion.cromos.forEach(cromo => {
        imgNames.push(cromo.nombreImagenCromoDelante);
        imgNames.push(cromo.nombreImagenCromoDetras);
      });

      let count: number = 0;

      //Recorre los nombres para descargar la imagen
      imgNames.forEach((name: string) => {
        this.imagenesService.downloadImgCromo(name).subscribe((data: any) => {
          //Añade la imagen a la carpeta
          folder.file(`${name}`, data);

          count++;

          //Crea el ZIP al haber descargado todas las fotos
          if (count == imgNames.length) {
            this.isDownloading = false;
            zip.generateAsync({ type: "blob" }).then(function (blob) {
              saveAs(blob, "Coleccion_" + rsc.nombre + ".zip");
            }, function (err) {
              this.isDownloading = false;
              console.log(err);
              Swal.fire('Error', 'Error al descargar:( Inténtalo de nuevo más tarde', 'error')
            });
          }
        });
      })
    });
  }


  //Función para descargar la familia de avatares
  descargaFamiliaAvatares(rsc: FamiliaAvatares) {

    this.isDownloading = true;

    this.familia = rsc

    console.log("Familia: ", this.familia)
    const theJSON = JSON.stringify(this.familia);

    let zip = new JSZip();
    let folder = zip.folder('Avatares_' + rsc.nombreFamilia);
    let compFolder = folder.folder('Imagenes complementos');
    folder.file(rsc.nombreFamilia + ".json", theJSON);

    console.log(rsc.silueta)

    this.imagenesService.downloadImgAvatar(rsc.silueta).subscribe((data: any) => {
      folder.file(`${rsc.silueta}`, data);

      let complementos = new Array<string>();
      rsc.complemento1.forEach(complemento => {
        complementos.push(complemento);
      });
      rsc.complemento2.forEach(complemento => {
        complementos.push(complemento);
      });
      rsc.complemento3.forEach(complemento => {
        complementos.push(complemento);
      });
      rsc.complemento4.forEach(complemento => {
        complementos.push(complemento);
      });

      if (complementos.length != 0) {
        let cont = 0;
        complementos.forEach(c => {
          this.imagenesService.downloadImgAvatar(c).subscribe((data) => {
            compFolder.file(c, data);
            cont++;
            if (cont == complementos.length) {
              this.isDownloading = false;
              zip.generateAsync({ type: "blob" }).then(function (blob) {
                saveAs(blob, 'Avatares_' + rsc.nombreFamilia + ".zip");
              }, function (err) {
                console.log(err);
                this.isDownloading = false;
                Swal.fire('Error', 'Error al descargar:( Inténtalo de nuevo más tarde', 'error')
              });
            }
          }, (error) => {
            console.log(error);
            this.isDownloading = false;
            Swal.fire('Error', 'Error al descargar imagen ' + c, 'error');
          });
        });
      }
    }, (error) => {
      console.log(error);
      this.isDownloading = false;
      Swal.fire('Error', 'Error al descargar imágenes', 'error');
    });

  }


  //Función para descargar la familia de imagenes de perfil
  descargaFamiliaImagenes(rsc: FamiliaDeImagenesDePerfil) {

    this.isDownloading = true;

    console.log("RSC: ", rsc);

    let zip = new JSZip();
    let folder = zip.folder('FamiliaImagenesDePerfil_' + rsc.nombreFamilia);

    let imgNames: string[] = rsc.imagenes;


    console.log(imgNames);
    let count: number = 0;

    imgNames.forEach((name: string) => {
      this.imagenesService.downloadImgPerfil(this.urlImagenesPerfil + name).subscribe((data: any) => {
        console.log('Img: ', data);
        //Añade la imagen a la carpeta
        folder.file(`${name}`, data);

        count++;

        //Crea el ZIP al haber descargado todas las fotos
        if (count == imgNames.length) {
          this.isDownloading = false;
          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, "FamiliaImagenesPerfil_" + rsc.nombreFamilia + ".zip");
          }, function (err) {
            console.log(err);
            this.isDownloading = false;
            Swal.fire('Error', 'Error al descargar:( Inténtalo de nuevo más tarde', 'error')
          });
        }
      });
    })
  }


  //Función para descargar la pregunta
  descargaPreguntas(rsc: Pregunta) {

    this.isDownloading = true;

    console.log("RSC: ", rsc)

    const theJSON = JSON.stringify(rsc);

    let zip = new JSZip();
    zip.file(rsc.titulo + ".json", theJSON);

    if (rsc.imagen != null) {
      this.imagenesService.downloadImgPregunta(rsc.imagen).subscribe((data: any) => {
        console.log("DATA: ", data)
        zip.file(`${rsc.imagen}`, data);
        this.isDownloading = false;
        zip.generateAsync({ type: "blob" }).then(function (blob) {
          saveAs(blob, 'Pregunta_' + rsc.titulo + ".zip");
        }, function (err) {
          console.log(err);
          this.isDownloading = false;
          Swal.fire('Error', 'Error al descargar:( Inténtalo de nuevo más tarde', 'error')
        })
      });
    }
    else {
      this.isDownloading = false;
      zip.generateAsync({ type: "blob" }).then(function (blob) {
        saveAs(blob, 'Pregunta_' + rsc.titulo + ".zip");
      }, function (err) {
        console.log(err);
        this.isDownloading = false;
        Swal.fire('Error', 'Error al descargar:( Inténtalo de nuevo más tarde', 'error')
      })
    }
  }

  //Función para descargar todas las preguntas que seleccione
  descargaPerguntasSeleccionadas() {

    let zip = new JSZip();

    //Creamos un array con las preguntas que queremos descargar para poder crear el json
    this.mapCheckPreguntas.forEach(recurso =>{
      this.listDescargasPreguntas.push(recurso);      
    })

      
    
    console.log("lista descargas:", this.listDescargasPreguntas);
    let json = JSON.stringify(this.listDescargasPreguntas)


    zip.file("Fichero.json", json);

    let imageNames = new Array<string>();

    //Creamos una lista con los nombres de las imagenes de las preguntas, si hay
    this.listDescargasPreguntas.forEach(recurso => {
      if (recurso.imagen != null) {
        imageNames.push(recurso.imagen);
      }
    })

    if (imageNames.length > 0) {
      let folder = zip.folder("Imagenes");
      let count = 0;
      imageNames.forEach(img => {
        this.imagenesService.downloadImgPregunta(img).subscribe((data: any) => {
          console.log("DATA:" + img, data)
          folder.file(`${img}`, data);
          count++;
          if (count == imageNames.length) {
            zip.generateAsync({ type: "blob" }).then(function (blob) {
              saveAs(blob, "Preguntas.zip");
            }, function (err) {
              console.log(err);
             
              Swal.fire('Error', 'Error al descargar:( Inténtalo de nuevo más tarde', 'error')
            })
          }


        });
      })
    }
    else {
      zip.generateAsync({ type: "blob" }).then(function (blob) {
        saveAs(blob, "Preguntas.zip");
      }, function (err) {
        console.log(err);
    
        Swal.fire('Error', 'Error al descargar:( Inténtalo de nuevo más tarde', 'error')
      })

    }

    this.resetDescargarPreguntasSeleccionadas();
  }

  resetDescargarPreguntasSeleccionadas(){
    //(<HTMLInputElement>document.getElementsByClassName('checkbox')).value
    this.listDescargasPreguntas = new Array<Pregunta>();
  }

  /********************************/
  /*FUNCIONES PARA BORRAR RECURSOS*/
  /********************************/

  borraRecurso(rsc) {
    switch (this.recurso) {

      case 'colecciones': {
        this.borraColeccion(rsc);
        break;
      }
      case 'avatares': {
        this.borraFamiliaAvatares(rsc);
        break;
      }
      case 'imagenes': {
        this.borraFamiliaImagenes(rsc);
        break;
      }
      case 'preguntas': {
        this.borraPregunta(rsc);
        break;
      }
    }
  }

  borraPregunta(rsc: any) {
    this.recursosService.deletePregunta(rsc.id).subscribe(() => {
      Swal.fire("Hecho", "Recurso eliminado correctamente", "success");
      this.DameTodasPreguntas();
    }), (error) => {
      console.log(error);
      Swal.fire("Error", "Error eliminando recurso", "error");
    }
  }

  borraColeccion(rsc: any) {
    this.recursosService.deleteColeccion(rsc.id).subscribe(() => {
      Swal.fire("Hecho", "Recurso eliminado correctamente", "success");
      this.DameColecciones();
    }), (error) => {
      console.log(error);
      Swal.fire("Error", "Error eliminando recurso", "error");
    }
  }
  borraFamiliaAvatares(rsc: any) {
    this.recursosService.deleteFamiliaAvatares(rsc.id).subscribe(() => {
      Swal.fire("Hecho", "Recurso eliminado correctamente", "success");
      this.DameFamiliasDeAvataresPublicas();
    }), (error) => {
      console.log(error);
      Swal.fire("Error", "Error eliminando recurso", "error");
    }
  }
  borraFamiliaImagenes(rsc: any) {
    this.recursosService.deleteFamiliaImagenesPerfil(rsc.id).subscribe(() => {
      Swal.fire("Hecho", "Recurso eliminado correctamente", "success");
      this.DameFamiliasImagenesPerfil();
    }), (error) => {
      console.log(error);
      Swal.fire("Error", "Error eliminando recurso", "error");
    }
  }



}



