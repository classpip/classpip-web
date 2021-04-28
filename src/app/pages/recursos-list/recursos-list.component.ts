import { Profesor } from './../../clases/Profesor';
import { RecursosService } from './../../services/recursos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FamiliaAvatares } from 'src/app/clases/FamiliaAvatares';

@Component({
  selector: 'app-recursos-list',
  templateUrl: './recursos-list.component.html',
  styleUrls: ['./recursos-list.component.scss']
})
export class RecursosListComponent implements OnInit {

  recurso: String;
  rscName: String;
  listRecursos;
  mapProfesores: Map<Number,Profesor> = new Map();
  

  constructor(private activeRoute: ActivatedRoute, private router: Router, private recursosService: RecursosService) { }

  /*

  FALTA POR CENTRAR EL LOADING EN EL HTML
  BOTON VOLVER

  */
  
  ngOnInit(): void {
    //Obtiene de la ruta el tipo de recurso que es
    this.recurso = this.activeRoute.snapshot.params.recurso;

    //Obtiene los profesores para poder obtener el nombre del propietario
    //Lo hace en caso de que este logueado, sino no verá los propietarios
    if(this.isLoggedIn()){
      this.recursosService.DameProfesores().subscribe(profesores => {
        profesores.forEach(prof => {
          this.mapProfesores.set(prof.id, prof);
        });
      });
    }

    //Carga los recursos correspondientes en la lista de recursos que se muestra
    //He puesto ya los casos para todos los recursos. Falta mirar aver si hay que quitar alguno
    switch(this.recurso){
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
        this.rscName ='Cuestionarios de Satisfacción';
        this.DameCuestionariosSatisfaccionPublicos();
        break;
      }

      case 'preguntas': {
        this.rscName = 'Preguntas';
        this.listRecursos = [];
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

  isLoggedIn(){
    if(sessionStorage.getItem('ACCESS_TOKEN') != null) return true;
    else return false;
  }

  //Función para volver a la página de recursos
  volver(){
    this.router.navigateByUrl('/recursos');
  }

  //Funcion que obtiene los recursos publicos de avatares
  DameFamiliasDeAvataresPublicas() {
    this.recursosService.DameFamiliasAvataresPublicas().subscribe ( res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if(this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function(obj) {
          obj['nombreRecurso'] = obj['NombreFamilia']; // Assign new key
          delete obj['NombreFamilia']; // Delete old key
          return obj;
        });
      }
    }); 
  }

  //Funcion que obtiene los recursos publicos de cuestionarios
  DameCuestionariosPublicos() {
    this.recursosService.DameCuestionariosPublicos().subscribe ( res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if(this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
          
        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function(obj) {
          obj['nombreRecurso'] = obj['Titulo']; // Assign new key
          delete obj['Titulo']; // Delete old key
          return obj;
        });
      }
    }); 
  }
//Funcion que obtiene los recursos publicos de cuestionarios de satisfaccion
  DameCuestionariosSatisfaccionPublicos() {
    this.recursosService.DameCuestionariosPublicos().subscribe ( res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if(this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
          
        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function(obj) {
          obj['nombreRecurso'] = obj['Titulo']; // Assign new key
          delete obj['Titulo']; // Delete old key
          return obj;
        });
      }
    }); 
  }

  //Funcion que obtiene los recursos publicos de imaganes de perfil
  DameFamiliasImagenesPerfil() {
    this.recursosService.DameFamiliasDeImagenesDePerfilPublicas().subscribe ( res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if(this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function(obj) {
          obj['nombreRecurso'] = obj['NombreFamilia']; // Assign new key
          delete obj['NombreFamilia']; // Delete old key
          return obj;
        });
      }
    }); 
  }

  //Funcion que obtiene los recursos publicos de colecciones
  DameColecciones() {
    this.recursosService.DameColeccionesPublicas().subscribe ( res => {
      console.log(res);
      if (res !== undefined) {
        //Carga los recursos en la lista
        this.listRecursos = res;

        //Cambia el profesorId por su nombre
        this.listRecursos.forEach(recurso => {
          if(this.mapProfesores.has(recurso.profesorId)) {
            recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
            recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
          } else {
            recurso.propietario = 'Desconocido';
          }
        });
        //Esto lo hacemos porque cada recurso llama de una forma distinta al nombre de este (NombreFamilias, Titulo...) y asi lo mapeamos 
        this.listRecursos = this.listRecursos.map(function(obj) {
          obj['nombreRecurso'] = obj['Nombre']; // Assign new key
          delete obj['Nombre']; // Delete old key
          return obj;
        });
      }
    }); 
  }

}
