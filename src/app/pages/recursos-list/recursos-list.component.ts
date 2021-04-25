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
  listRecursos: FamiliaAvatares[];
  mapProfesores: Map<Number,Profesor> = new Map();

  constructor(private activeRoute: ActivatedRoute, private router: Router, private recursosService: RecursosService) { }

  ngOnInit(): void {
    this.recurso = this.activeRoute.snapshot.params.recurso;
    this.DameFamiliasDeAvataresPublicas();
  }

  volver(){
    this.router.navigateByUrl('/recursos');
  }

  /* this.DameTodosLosCuestionariosPublicos();
  this.DameTodasLasColeccionesPublicas();
  this.DameTodosLosCuestionariosDeSatisfaccionPublicos();
  this.DameFamiliasDeImagenesDePerfilPublicas();
*/

  DameFamiliasDeAvataresPublicas() {
    // traigo todos los publicos excepto los del profesor
    this.recursosService.DameFamiliasAvataresPublicas()
    .subscribe ( res => {
      console.log(res);
      if (res !== undefined) {
        this.listRecursos = res;
        this.recursosService.DameProfesores()
        .subscribe ( profesores => {
          profesores.forEach(prof => {
            this.mapProfesores.set(prof.id, prof);
          });
          this.listRecursos.forEach(recurso => {
            if(this.mapProfesores.has(recurso.profesorId)) {
              recurso.propietario = this.mapProfesores.get(recurso.profesorId).Nombre + ' ';
              recurso.propietario += this.mapProfesores.get(recurso.profesorId).PrimerApellido;
            }
          })
        });
      }
    }); 
  }

}
