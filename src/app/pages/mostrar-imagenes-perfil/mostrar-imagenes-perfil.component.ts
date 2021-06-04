import { Router } from '@angular/router';
import { RecursosService } from './../../services/recursos.service';
import { Component, OnInit } from '@angular/core';
import { Profesor } from 'src/app/clases/Profesor';
import { FamiliaDeImagenesDePerfil } from 'src/app/clases/recursos/FamiliaDeImagenesDePerfil';
import { SesionService } from 'src/app/services/sesion.service';
import * as URL from 'src/app/URLs/urls'
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-mostrar-imagenes-perfil',
  templateUrl: './mostrar-imagenes-perfil.component.html',
  styleUrls: ['./mostrar-imagenes-perfil.component.scss']
})
export class MostrarImagenesPerfilComponent implements OnInit {

  profesor: Profesor;
  familias: FamiliaDeImagenesDePerfil[];
  familiasPublicas:  FamiliaDeImagenesDePerfil[];
  listaFamilias: any[] = [];
  listaFamiliasPublicas: any[] = [];
  dataSource;
  dataSourcePublicas;
  propietarios: string[];
  displayedColumns: string[] = [ 'nombreFamilia', 'numeroImagenes', 'ejemplos', 'iconos'];
  displayedColumnsPublicas: string[] = [ 'nombreFamilia', 'numeroImagenes', 'ejemplos'];

  constructor(
                private recursos: RecursosService,
                private sesion: SesionService,
                private router: Router
  ) { }

  ngOnInit(): void {
    this.profesor = this.sesion.DameProfesor();
    
    this.DameFamiliasDeImagenesDePerfilPublicas();
  }

  DameFamiliasDeImagenesDePerfilPublicas() {
    // traigo todas las familias publicas
    this.recursos.DameFamiliasDeImagenesDePerfilPublicas()
    .subscribe ( res => {
      console.log ('familias publicas');
      console.log (res);
      if (res[0] !== undefined) {
        // quito las que son del profesor
        this.familiasPublicas = res.filter (familia => familia.profesorId !== this.profesor.id);
        if (this.familiasPublicas.length === 0) {
          this.familiasPublicas = undefined;

        } else {
          this.familiasPublicas.forEach (f => {
            const ejemploImagen1 = URL.ImagenesPerfil + f.imagenes[0];
            const ejemploImagen2 = URL.ImagenesPerfil + f.imagenes[1];
            const ejemploImagen3 = URL.ImagenesPerfil + f.imagenes[2];
            this.listaFamiliasPublicas.push ({
              familia: f,
              ejemplo1: ejemploImagen1,
              ejemplo2: ejemploImagen2,
              ejemplo3: ejemploImagen3
            });
          });
          this.dataSourcePublicas = new MatTableDataSource(this.listaFamiliasPublicas);
          this.propietarios = [];
          // Traigo profesores para preparar los nombres de los propietarios
          this.recursos.DameProfesores()
          .subscribe ( profesores => {
            this.familiasPublicas.forEach (familia => {
              const propietario = profesores.filter (p => p.id === familia.profesorId)[0];
              this.propietarios.push (propietario.nombre + ' ' + propietario.primerApellido);
            });
          });
        }
      }
    });
  }


  goBack() {
    this.router.navigateByUrl('/recursos/imagenes');
  }

}
