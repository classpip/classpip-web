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
  profesorId: number;


  //Recuros
  cuestionario: Cuestionario;
  coleccion: any;
  familia: FamiliaAvatares;
  listaFamiliasPublicas: any[] = [];
  cromosColeccion: Cromo[];


  interval;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private recursosService: RecursosService,
    private sesion: SesionService
  ) { }

  /*

  FALTA POR CENTRAR EL LOADING EN EL HTML
  BOTON VOLVER

  */

  ngOnInit(): void {
    //Obtiene de la ruta el tipo de recurso que es
    this.recurso = this.activeRoute.snapshot.params.recurso;

    //Obtiene los profesores para poder obtener el nombre del propietario
    //Lo hace en caso de que este logueado, sino no verá los propietarios
    if (this.isLoggedIn()) {
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

      case 'cuestionarios': {
        this.rscName = 'Cuestionarios';
        this.DameCuestionariosPublicos();
        break;
      }

      case 'imagenes': {
        this.rscName = 'Imágenes de perfil';
        this.DameFamiliasImagenesPerfil();
        break;
      }

      case 'rubricas': {
        this.rscName = 'Rúbricas';
        this.listRecursos = [];
        break;
      }

      case 'satisfaccion': {
        this.rscName = 'Cuestionarios de Satisfacción';
        this.DameCuestionariosSatisfaccionPublicos();
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

      case 'puntos': {
        this.rscName = 'Puntos';
        this.listRecursos = [];
        break;
      }

      case 'escenarios': {
        this.rscName = 'Escenarios';
        this.listRecursos = [];
        break;
      }
    }
  }

  isLoggedIn() {
    if (sessionStorage.getItem('ACCESS_TOKEN') != null) return true;
    else return false;
  }

  isImagenes() {
    if (this.recurso == 'imagenes')
      return true;


    else return false;
  }

  //Función para volver a la página de recursos
  volver() {
    this.router.navigateByUrl('/recursos');
  }

  /*FUNCIONES PARA OBTENER LA LISTA DE RECURSOS*/

  //Funcion que obtiene los recursos publicos de avatares
  DameFamiliasDeAvataresPublicas() {
    this.recursosService.DameFamiliasAvataresPublicas().subscribe(res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if (this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['NombreFamilia']; // Assign new key
          //delete obj['NombreFamilia']; // Delete old key
          return obj;
        });
      }
    });
  }

  //Funcion que obtiene los recursos publicos de cuestionarios
  DameCuestionariosPublicos() {
    this.recursosService.DameCuestionariosPublicos().subscribe(res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          console.log("Holi este es el id:", recurso.id)
          if (this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }

        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['Titulo']; // Assign new key
          //delete obj['Titulo']; // Delete old key
          return obj;
        });
      }
    });
  }
  //Funcion que obtiene los recursos publicos de cuestionarios de satisfaccion
  DameCuestionariosSatisfaccionPublicos() {
    this.recursosService.DameCuestionariosPublicos().subscribe(res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if (this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }

        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['Titulo']; // Assign new key
          //delete obj['Titulo']; // Delete old key
          return obj;
        });
      }
    });
  }

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
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }

        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['NombreFamilia']; // Assign new key
          obj['ejemplos'] = obj['Imagenes'];
          //delete obj['NombreFamilia']; // Delete old key
          return obj;
        });

        //Carga las fotos de ejemplo
        this.listRecursos.forEach(recurso => {
          for (let i = 0; i < recurso.ejemplos.length; i++) {
            recurso.ejemplos[i] = URL.ImagenesPerfil + recurso.ejemplos[i];
          }
        });
      }

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
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['Nombre']; // Assign new key
          //delete obj['Nombre']; // Delete old key
          return obj;
        });
      }
    });
  }

  DameTodasPreguntas() {
    this.recursosService.DamePreguntas().subscribe(res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if (this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function (obj) {
          obj['nombreRecurso'] = obj['Titulo']; // Assign new key
          //delete obj['NombreFamilia']; // Delete old key
          return obj;
        });
      }
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
    }
  }

  /*************************************/
  /* FUNCIONES PARA DESCARGAR RECURSOS */
  /*************************************/

  //Función para descargar la colección
  descargaColeccion(rsc: any) {

    let zip = new JSZip();
    let folder = zip.folder('recursos');

    console.log("RSC: ", rsc)

    this.coleccion = {
      Nombre: rsc.Nombre,
      ImagenColeccion: rsc.ImagenColeccion,
      DosCaras: rsc.DosCaras,
      cromos: []
    };

    console.log("Coleccion: ", this.coleccion)

    this.recursosService.DameCromosColeccion(rsc.id)
      .subscribe(cromos => {
        console.log(cromos)
        cromos.forEach(cromo => {
          console.log(cromo)
          const c = {
            nombreCromo: cromo.Nombre,
            nombreImagenCromoDelante: cromo.ImagenDelante,
            nombreImagenCromoDetras: cromo.ImagenDetras,
            nivelCromo: cromo.Nivel,
            probabilidadCromo: cromo.Probabilidad,
          };
          this.coleccion.cromos.push(c);
          console.log("c: ", c);
          console.log("Coleccion2: ", this.coleccion)
        });

        const theJSON = JSON.stringify(this.coleccion);
        console.log("JSON: ", theJSON)
        
        folder.file(rsc.Nombre + ".json", theJSON);
        console.log("ZIP");

        let imgNames: string[] = [];
        this.coleccion.cromos.forEach(cromo => {
          imgNames.push(cromo.nombreImagenCromoDelante);
          imgNames.push(cromo.nombreImagenCromoDetras);
        });

        imgNames.forEach((name: string) => {
          
        })
        /* for (let i = 0; i < cromos.length; i++) {
  
          console.log('index: '+this.coleccion.cromos[i].nombreImagenCromoDelante);
          this.recursosService.DameImagenCromo(this.coleccion.cromos[i].nombreImagenCromoDelante).subscribe((data: any) => {
            //Add the image to the folder 
            folder.file(`${this.coleccion.cromos[i].nombreImagenCromoDelante}.png`, data);

            // Generate a zip file asynchronously and trigger the download
            folder.generateAsync({ type: "blob" }).then(content => saveAs(content, "files"));
          });
          this.recursosService.DameImagenCromo(this.coleccion.cromos[i].nombreImagenCromoDetras).subscribe((data: any)=>{
            //Add the image to the folder 
            folder.file(`${this.coleccion.cromos[i].nombreImagenCromoDetras}.png`, data);

            // Generate a zip file asynchronously and trigger the download
            folder.generateAsync({ type: "blob" }).then(content => saveAs(content, "files"));
          });
          // this.cromo = this.cromosColeccion[i];
          // this.imagenesCromosDelante[i] = URL.ImagenesCromo + this.cromo.ImagenDelante;
          // this.imagenesCromosDetras[i] = URL.ImagenesCromo + this.cromo.ImagenDetras;
  
        } */

        zip.generateAsync({ type: "blob" }).then(function (blob) {
          saveAs(blob, rsc.Nombre + ".zip");
        }, function (err) {
          //jQuery("#blob").text(err);
        });
      });

    /* //Add the image to the folder 
    folder.file(`${name}.jpg`, fileImg);

    // Generate a zip file asynchronously and trigger the download
    folder.generateAsync({ type: "blob" }).then(content => saveAs(content, "files")); */

    

  }

  //Función para descargar la colección
  descargaFamiliaAvatares(rsc: any) {

    console.log("RSC: ", rsc)

    this.familia = rsc

    console.log("Familia: ", this.familia)
    const theJSON = JSON.stringify(this.familia);
    console.log (theJSON);

    let zip = new JSZip();
    let folder = zip.folder('recursos');
    folder.file(rsc.NombreFamilia + ".json", theJSON);
    console.log("ZIP")

    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, rsc.NombreFamilia + ".zip");
    }, function (err) {
      //jQuery("#blob").text(err);
    })

  }

  descargaFamiliaImagenes(rsc: any) {

    console.log("RSC: ", rsc)

    
    /* const theJSON = JSON.stringify(rsc);
    console.log (theJSON);

    let zip = new JSZip();
    let folder = zip.folder('recursos');
    folder.file(rsc.NombreFamilia + ".json", theJSON);
    console.log("ZIP")

    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, rsc.NombreFamilia + ".zip");
    }, function (err) {
      //jQuery("#blob").text(err);
    }) */

  }
  

 


}
