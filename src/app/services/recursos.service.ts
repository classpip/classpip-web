import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FamiliaAvatares } from '../clases/FamiliaAvatares';
import * as environment from './../../environments/environment';
import { Profesor } from '../clases/Profesor';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {

  private host = environment.host;

  private APIUrlProfesores = this.host + ':3000/api/Profesores';

  private APIUrlFamiliarAvatares = this.host + ':3000/api/familiasAvatares';

  constructor(private http: HttpClient) { }

  public DameProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.APIUrlProfesores);
  }

  public DameFamiliasAvataresPublicas(): Observable<FamiliaAvatares[]> {
    console.log(this.APIUrlFamiliarAvatares + '?filter[where][Publica]=true')
    return this.http.get<FamiliaAvatares[]>(this.APIUrlFamiliarAvatares
      + '?filter[where][Publica]=true');
  }
}
