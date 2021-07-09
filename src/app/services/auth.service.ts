import { HttpClient } from '@angular/common/http';
import * as environment from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profesor } from '../clases/Profesor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private host = environment.host;

  private APIUrlProfesores = this.host + ':3000/api/Profesores';
  private APIUrlTokens = this.host + ':3000/api/AccessTokens'

  constructor(private http: HttpClient) { }

  ///////////////// CHECK LOGGED IN ////////////////////

  //true si esta, false si no
  public isLoggedIn(){
    if(sessionStorage.getItem('ACCESS_TOKEN') !== null || localStorage.getItem('ACCESS_TOKEN') !== null)
      return true;
    else return false;
  }

  public setAccessToken(token: string){
    sessionStorage.setItem('ACCESS_TOKEN', token);
  }

  public setLocalAccessToken(token: string){
    localStorage.setItem('ACCESS_TOKEN', token);
  }

  public getUserIdByToken(token: string){
    return this.http.get(this.APIUrlTokens + '/' + token);
  }

  ///////////////// PETICIONES PROFESOR ///////////////////

  public getProfesor(userId: string): Observable<Profesor> {
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][id]=' + userId);
  }

  public getProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.APIUrlProfesores);
  }
  
  public register(profesor: Profesor): Observable<Profesor> {
    return this.http.post<Profesor>(this.APIUrlProfesores, profesor);
  }  

  public login(body: any): Observable<any> {
    return this.http.post(this.APIUrlProfesores + '/login', body);
  }

  public logout(): Observable<any> {
    //No necesita body porque hace el logout con el access token que añade el interceptor
    return this.http.post(this.APIUrlProfesores + '/logout', null);
  }

  public updateProfesor (id: number, body: Profesor){
    return this.http.put(this.APIUrlProfesores + '/' + id, body);
  }

  public updateUserImage (id: number, body: any){
    return this.http.patch(this.APIUrlProfesores + '/' + id, body);
  }

  public checkUsername(username: string): Observable<Profesor> {
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][username]=' + username);
  }

  public checkEmail(email: string): Observable<Profesor> {
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][email]=' + email);
  }
  
  //Faltan peticiones cambiar/forget contraseña
  
  // public changeNameOrEmail(body: any, id: number): Observable<any> {
  //   //En el body pasamos id y nuevo username y/o email
  //   return this.http.post(this.APIUrlUsers + '/update?[where][id]='+id, body);
  // }
  
  public changePassword(old: String, newPass: String): Observable<any> {
    return this.http.post(this.APIUrlProfesores + '/change-password', {"oldPassword": old, "newPassword": newPass});
  }
}
