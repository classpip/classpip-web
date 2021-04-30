import { FamiliaAvatares } from './../clases/FamiliaAvatares';
import { Injectable } from '@angular/core';
import { Profesor } from '../clases/Profesor';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  profesor: Profesor;
  profesorObservable = new ReplaySubject(1);
  familia: FamiliaAvatares;

  private dataSubject = new Subject<any>();


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

  public publish(data: any){
    this.dataSubject.next(data);
  }

  public getObservable(): Subject<any> {
    return this.dataSubject;
  }

  public DameFamilia(): FamiliaAvatares {
    return this.familia;
  }

  public TomaFamilia(familia: FamiliaAvatares) {
    this.familia = familia;
  }
}
