import { FamiliaAvatares } from './../clases/recursos/FamiliaAvatares';
import { Injectable } from '@angular/core';
import { Profesor } from '../clases/Profesor';
import { ReplaySubject, Subject } from 'rxjs';
import { Cuestionario } from '../clases/recursos/Cuestionario';
import { Coleccion } from '../clases/recursos/Coleccion';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  profesor: Profesor;
  profesorObservable = new ReplaySubject(1);
  familia: FamiliaAvatares;
  cuestionario: Cuestionario;
  coleccion: Coleccion;

  private dataSubject = new Subject<any>();


  constructor() { }

  public TomaProfesor(profesor: Profesor) {
    this.profesor = profesor;
  }
  public DameProfesor(): Profesor {
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

  public publish(data: any) {
    this.dataSubject.next(data);
  }

  public getObservable(): Subject<any> {
    return this.dataSubject;
  }

  //FAMILIAS DE AVATARES
  public TomaFamilia(familia: FamiliaAvatares) {
    this.familia = familia;
  }

  public DameFamilia(): FamiliaAvatares {
    return this.familia;
  }

  //CUESTIONARIOS
  public TomaCuestionario(cuestionario: Cuestionario) {
    this.cuestionario = cuestionario;
  }

  public DameCuestionario(): Cuestionario {
    return this.cuestionario;
  }

  //COLECCIONES
  public TomaColeccion(coleccion: Coleccion) {
    this.coleccion = coleccion;
  }
  
  public DameColeccion(): Coleccion {
    return this.coleccion;
  }


}
