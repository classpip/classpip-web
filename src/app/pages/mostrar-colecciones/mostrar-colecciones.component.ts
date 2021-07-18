import { Router } from '@angular/router';
import { RecursosService } from './../../services/recursos.service';
import { AuthService } from './../../services/auth.service';
import { SesionService } from 'src/app/services/sesion.service';
import { Coleccion } from './../../clases/recursos/Coleccion';
import { Cromo } from './../../clases/recursos/Cromo';
import { Component, OnInit } from '@angular/core';
import * as URL from 'src/app/URLs/urls'


@Component({
  selector: 'app-mostrar-colecciones',
  templateUrl: './mostrar-colecciones.component.html',
  styleUrls: ['./mostrar-colecciones.component.scss']
})
export class MostrarColeccionesComponent implements OnInit {

  coleccion: Coleccion;
  cromosColeccion: Cromo[];
  cromo: Cromo;

  imagenCromo: string;
  imagenesCromosDelante: string[] = [];
  imagenesCromosDetras: string[] = [];

  nombreColeccion: string;

  // imagen coleccion
  imagenColeccion: string;
  nombreImagenColeccion: string;
  file: File;

  // tslint:disable-next-line:ban-types
  imagenCambiada: Boolean = false;

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Confirma que quieres eliminar el equipo llamado: ';

  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;
  // tslint:disable-next-line:ban-types
  voltear: Boolean = false;
  // tslint:disable-next-line:ban-types
  mostrarTextoGuardar: Boolean = false;

  interval;

  cromoGirado: boolean[] = new Array<boolean>();

  constructor(
    private sesion:SesionService,
    private auth:AuthService,
    private recursos: RecursosService,
    
    private router: Router
  ) { }

  ngOnInit(): void {
    this.coleccion = this.sesion.DameColeccion();
    console.log("coleccion viene de sesion: ", this.coleccion)
    if(this.coleccion != null){
      this.nombreColeccion = this.coleccion.nombre;
      if (this.coleccion.imagenColeccion !== undefined) {
        this.imagenColeccion = URL.ImagenesColeccion + '/download/' + this.coleccion.imagenColeccion ;
      } else {
        this.imagenColeccion = undefined;
      }
  
      this.recursos.DameCromosColeccion (this.coleccion.id)
      .subscribe ( cromos => {
        this.cromosColeccion = cromos;
        console.log("cromos viene de recursos: ", this.cromosColeccion);
        // Ahora preparo las imagenes de los cromos
           // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.cromosColeccion.length; i++) {
  
          this.cromoGirado.push(false);
          this.cromo = this.cromosColeccion[i];
          this.imagenesCromosDelante[i] = URL.ImagenesCromo + '/download/' + this.cromo.imagenDelante;
          this.imagenesCromosDetras[i] = URL.ImagenesCromo + '/download/' + this.cromo.imagenDetras;
  
        }

        console.log('girado array: ', this.cromoGirado);

      });
    } else {
      this.nombreColeccion = 'ERROR: No se pueden visualizar los recursos.';
    }
  }

 
  goBack() {
      this.router.navigateByUrl('/recursos/colecciones');
  }
  Voltear() {
    this.voltear = !this.voltear;
    this.cromoGirado = [];
    this.cromosColeccion.forEach(() => {
      if(this.voltear) this.cromoGirado.push(true);
      else this.cromoGirado.push(false);
    })
    console.log('array todos: ', this.cromoGirado);
  }

  girarCromo(i){
    console.log('array1: ', this.cromoGirado);
    if(this.cromoGirado[i] == false){
      this.cromoGirado[i] = true;
      console.log('array2: ', this.cromoGirado);
    } else {
      this.cromoGirado[i] = false;
      console.log('array2: ', this.cromoGirado);
    }
  }

}
