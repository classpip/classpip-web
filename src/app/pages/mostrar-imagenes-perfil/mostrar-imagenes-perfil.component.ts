import { Router } from '@angular/router';
import { RecursosService } from './../../services/recursos.service';
import { Component, OnInit } from '@angular/core';
import { Profesor } from 'src/app/clases/Profesor';
import { FamiliaDeImagenesDePerfil } from 'src/app/clases/recursos/FamiliaDeImagenesDePerfil';
import { SesionService } from 'src/app/services/sesion.service';
import * as URL from 'src/app/URLs/urls'


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
    /* this.profesor = this.sesion.DameProfesor();
    this.recursos.DameFamiliasDeImagenesDePerfilProfesor (this.profesor.id)
    .subscribe (familias => {
      if (familias.length !== 0) {
        this.familias = familias;
        console.log ('ya tengo las familias de imagenes de perfil');
        console.log (familias);
        this.familias.forEach (f => {
          const ejemploImagen1 = URL.ImagenesPerfil + f.Imagenes[0];
          const ejemploImagen2 = URL.ImagenesPerfil + f.Imagenes[1];
          const ejemploImagen3 = URL.ImagenesPerfil + f.Imagenes[2];
          this.listaFamilias.push ({
            familia: f,
            ejemplo1: ejemploImagen1,
            ejemplo2: ejemploImagen2,
            ejemplo3: ejemploImagen3
          });
        });
        console.log ('ya tengo la lista');
        console.log (this.listaFamilias);
        this.dataSource = new MatTableDataSource(this.listaFamilias);
      } else {
        this.familias = undefined;
      }
    });
    this.DameFamiliasDeImagenesDePerfilPublicas(); */
  }

}
