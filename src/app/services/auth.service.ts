import { HttpClient } from '@angular/common/http';
import * as environment from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profesor } from '../clases/Profesor';
import { FamiliaAvatares } from './../clases/FamiliaAvatares';
import { User } from '../clases/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  profesorId: number;

  private host = environment.host;

  private APIUrlUsers = this.host + ':3000/api/Users';
  private APIUrlProfesores = this.host + ':3000/api/Profesores';

  constructor(private http: HttpClient) { }

  ///////////////// CHECK LOGGED IN ////////////////////

  //true si esta, false si no
  public isLoggedIn(){
    return sessionStorage.getItem('ACCESS_TOKEN') !== null;
  }

  ///////////////// PETICIONES PROFESOR ///////////////////

  public dameProfesor(userId: string): Observable<Profesor> {
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][userId]=' + userId);
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

  ///////////////// PETICIONES USER ///////////////////

  public register(body: User): Observable<any> {
    return this.http.post(this.APIUrlUsers, body);
  }

  public login(body: any): Observable<any> {
    return this.http.post(this.APIUrlUsers + '/login', body);
  }

  public logout(): Observable<any> {
    //No necesita body porque hace el logout con el access token que añade el interceptor
    return this.http.post(this.APIUrlUsers + '/logout', null);
  }
  
  public getUser(id: number): Observable<any> {
    return this.http.get<User>(this.APIUrlUsers + '/' + id);
  }

  public checkUsername(username: string): Observable<User> {
    return this.http.get<User>(this.APIUrlUsers + '?filter[where][username]=' + username);
  }

  public checkEmail(email: string): Observable<User> {
    return this.http.get<User>(this.APIUrlUsers + '?filter[where][username]=' + email);
  }
  
  //Faltan peticiones cambiar/forget contraseña
  
  // public changeNameOrEmail(body: any, id: number): Observable<any> {
  //   //En el body pasamos id y nuevo username y/o email
  //   return this.http.post(this.APIUrlUsers + '/update?[where][id]='+id, body);
  // }
  
  // public changePassword(old: String, newPass: String): Observable<any> {
  //   return this.http.post(this.APIUrlUsers + '/change-password', {"oldPassword": old, "newPassword": newPass});
  // }
}
