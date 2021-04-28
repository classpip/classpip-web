import { HttpClient } from '@angular/common/http';
import * as environment from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profesor } from '../clases/Profesor';
import { FamiliaAvatares } from './../clases/FamiliaAvatares';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  profesorId: number;

  private host = environment.host;

  private APIUrlUsers = this.host + ':3000/api/Users';
  private APIUrlProfesores = this.host + ':3000/api/Profesores';

  constructor(private http: HttpClient) { }

  //true si esta, false si no
  public isLoggedIn(){
    return sessionStorage.getItem('ACCESS_TOKEN') !== null;
  }

  public dameProfesor(userId: string): Observable<Profesor> {
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][userId]=' + userId);
  }
  public BuscaNombreUsuario(username: string): Observable<Profesor> {
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][NombreUsuario]=' + username);
  }
  public RegistraProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.post<Profesor>(this.APIUrlProfesores, profesor);
  }

  public getProfesorId(){
    return this.profesorId;
  }

  public setProfesorId(profesorid: number){
      this.profesorId = profesorid;
  }

  public login(body: any): Observable<any> {
    return this.http.post(this.APIUrlUsers + '/login', body);
  }
}
