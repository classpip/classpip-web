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
  
  private APIUrlProfesores = this.host + '3000/api/Profesores'

  constructor(private http: HttpClient) { }

  public dameProfesor(username: string, password: string): Observable<Profesor> {
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][NombreUsuario]=' + username + '&filter[where][Password]=' + password);
  }
}
