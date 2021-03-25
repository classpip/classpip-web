import { Injectable } from '@angular/core';
import { Profesor } from '../clases/Profesor';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  profesor: Profesor;
  profesorObservable = new ReplaySubject(1);
  
  posicion: any;
  tiposPuntosDelJuego: any;
  nivelesDelJuego: any;
  alumnoSeleccionado: any;
  inscripcionAlumnoJuego: any;
  equipoSeleccionado: any;
  inscripcionEquipoJuego: any;

  alumnosDelJuego: any;
  listaAlumnosOrdenadaPorPuntos: any;
  rankingJuegoDePuntos: any;
  equiposDelJuego: any;
  listaEquiposOrdenadaPorPuntos: any;
  rankingEquiposJuegoDePuntos: any;

  alumno: any;
  inscripcionAlumno: any;
  inscripcionEquipo: any;
  listaGrupos: any;
  imagenLogoEquipo: any;

  

  jornadas: any;
  JornadasCompeticion: any;
  
  // listaEquiposGrupo: any;


  constructor() { }
  public TomaProfesor(profesor: Profesor) {
    this.profesor = profesor;
  }
  public  DameProfesor(): Profesor {
    return this.profesor;
  }

  // uso un servicio de notificación de nuevo profesor
  // basado en observables. El componente navbar se suscribirá
  // para recibir los datos del profesor que se loguea o un profesor undefined
  // cuando se haga el logout. Asi podrá actualizar inmediatamente la barra de navagación.
  public EnviameProfesor(): any {
    return this.profesorObservable;
  }

  public EnviaProfesor(profesor: Profesor) {
    this.profesor = profesor;
    this.profesorObservable.next(profesor);
  }
}
