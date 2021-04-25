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
  listRecursos: FamiliaAvatares[];
  mapProfesores: Map<Number,Profesor> = new Map();

  constructor(private activeRoute: ActivatedRoute, private router: Router, private recursosService: RecursosService) { }

  /* PETICIONES QUE FALTAN X HACER 

  (son las que he visto que tienen recursos publicos, las demas no salia lo de recursos publicos en el dashboard: 
  no se si es que no existen o keloke)

  this.DameTodosLosCuestionariosPublicos();
  this.DameTodasLasColeccionesPublicas();
  this.DameTodosLosCuestionariosDeSatisfaccionPublicos();
  this.DameFamiliasDeImagenesDePerfilPublicas();

  */
  
  ngOnInit(): void {
    //Obtiene de la ruta el tipo de recurso que es
    this.recurso = this.activeRoute.snapshot.params.recurso;

    //Obtiene los profesores para poder obtener el nombre del propietario
    this.recursosService.DameProfesores().subscribe(profesores => {
      profesores.forEach(prof => {
        this.mapProfesores.set(prof.id, prof);
      });
    });

    //Carga los recursos correspondientes en la lista de recursos que se muestra
    switch(this.recurso){
      case 'avatares': {
        this.rscName = 'Avatares';
        this.DameFamiliasDeAvataresPublicas();
        break;
      }

      case 'cuestionarios': {
        this.rscName = 'Cuestionarios';
        break;
      }

      case 'imagenes': {
        this.rscName = 'Imágenes de perfil';
        break;
      }

      case 'rubricas': {
        this.rscName = 'Rúbricas';
        break;
      }

      case 'satisfaccion': {
        this.rscName ='Cuestionarios de satisfacción';
        break;
      }

      case 'preguntas': {
        this.rscName = 'Preguntas';
        break;
      }

      case 'colecciones': {
        this.rscName = 'Colecciones';
        break;
      }

      case 'puntos': {
        this.rscName = 'Puntos';
        break;
      }
      
      case 'escenarios': {
        this.rscName = 'Escenarios';
        break;
      }
    }
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

      }
    }); 
  }

}
