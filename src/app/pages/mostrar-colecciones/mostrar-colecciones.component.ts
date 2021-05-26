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
      this.nombreColeccion = this.coleccion.Nombre;
      if (this.coleccion.ImagenColeccion !== undefined) {
        this.imagenColeccion = URL.ImagenesColeccion + this.coleccion.ImagenColeccion ;
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
  
          this.cromo = this.cromosColeccion[i];
          this.imagenesCromosDelante[i] = URL.ImagenesCromo + this.cromo.ImagenDelante;
          this.imagenesCromosDetras[i] = URL.ImagenesCromo + this.cromo.ImagenDetras;
  
        }
  
      });
    } else {
      this.nombreColeccion = 'ERROR: No se pueden visualizar los recursos.';
    }
  }

  // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
  TraeImagenesCromos() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      this.cromo = this.cromosColeccion[i];
      this.imagenesCromosDelante[i] = URL.ImagenesCromo + this.cromo.ImagenDelante;
      this.imagenesCromosDetras[i] = URL.ImagenesCromo + this.cromo.ImagenDetras;

    }
  }

  // Le pasamos la coleccion y buscamos la imagen que tiene y las imagenes de sus cromos
  TraeImagenColeccion(coleccion: Coleccion) {

    console.log('entro a buscar cromos y foto');
    console.log(coleccion.ImagenColeccion);
    // Si la coleccion tiene una foto (recordemos que la foto no es obligatoria)
    if (coleccion.ImagenColeccion !== undefined) {

      this.imagenColeccion = URL.ImagenesColeccion + coleccion.ImagenColeccion ;

      // Sino la imagenColeccion será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
    } else {
      this.imagenColeccion = undefined;
    }


    // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
    console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

    // Ordena los cromos por nombre. Asi si tengo algun cromo repetido, salen juntos
    this.cromosColeccion.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
    this.TraeImagenesCromos();

  }

  GuardarColeccion() {
    this.mostrarTextoGuardar = true;
    // delete this.familiaElegida.id;
    // delete this.familiaElegida.profesorId;

    // creamos un objeto con los datos de la colección tal y como se necesitan
    // para generar el JSON
    const coleccion = {
      Nombre:  this.coleccion.Nombre,
      ImagenColeccion: this.coleccion.ImagenColeccion,
      DosCaras: this.coleccion.DosCaras,
      cromos: []
    };
    this.cromosColeccion.forEach (cromo => {
      const c = {
        nombreCromo: cromo.Nombre,
        nombreImagenCromoDelante: cromo.ImagenDelante,
        nombreImagenCromoDetras: cromo.ImagenDetras,
        nivelCromo: cromo.Nivel,
        probabilidadCromo: cromo.Probabilidad,
      };
      coleccion.cromos.push(c);
    });

    console.log ('asi queda la colección');
    console.log (coleccion);




    const theJSON = JSON.stringify(coleccion);
    console.log ('asi queda el JSON');
    console.log (theJSON);

    const uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON);

    // Este es un nuevo caso en el que tenemos que obtener de la vista html un elemento
    // que está protegido por un *ngIf. El sistema primero intenta obtener el elemento y puede
    // encontrar que el elemento aún no existe. Para invertir el orden ponemos un temporizador,
    // con lo que primero creará el elemento y luego lo obtendrá. Un tiempo 0 es suficiente.

    this.interval = setInterval(() => {
      const a = document.getElementById('generarJSON');
      a.setAttribute ('href', uri);
      a.setAttribute ('download', this.coleccion.Nombre);
      a.innerHTML = "Botón derecho y selecciona 'deja el enlace como...'";
      clearInterval(this.interval);
    }, 0);

  }

  goBack() {
      this.router.navigateByUrl('/recursos/colecciones');
  }
  Voltear() {
    this.voltear = !this.voltear;
  }

}
