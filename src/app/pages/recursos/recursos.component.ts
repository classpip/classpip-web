import { MatTableDataSource } from '@angular/material/table';
import { FamiliaAvatares } from './../../clases/FamiliaAvatares';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {
  isCollapsed = true;

  familiasPublicas: FamiliaAvatares[]
  propietarios: string[];
  dataSource;
  dataSourcePublicas;
  profesorId: number;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.DameFamiliasDeAvataresPublicas();
  }
  DameFamiliasDeAvataresPublicas() {
    // traigo todos los publicos excepto los del profesor
    this.authService.DameFamiliasAvataresPublicas()
    .subscribe ( res => {
      if (res[0] !== undefined) {
        this.familiasPublicas = res.filter (familia => familia.profesorId !== this.profesorId);
        if (this.familiasPublicas.length === 0) {
          this.familiasPublicas = undefined;
        } else {
          this.dataSourcePublicas = new MatTableDataSource(this.familiasPublicas);
          this.propietarios = [];
          // Traigo profesores para preparar los nombres de los propietarios
          this.authService.DameProfesores()
          .subscribe ( profesores => {
            this.familiasPublicas.forEach (familia => {
              const propietario = profesores.filter (p => p.id === familia.profesorId)[0];
              this.propietarios.push (propietario.Nombre + ' ' + propietario.PrimerApellido);
            });
          });
        }
      }
    });
  }

}
