// para hacer esto he usado el tutorial:
// https://codingblast.com/chat-application-angular-socket-io/
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Profesor} from '../clases/Profesor';
import * as environment from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComServerService {

  private socket;

  constructor() {}

  public Conectar(profesorId: number) {
    this.socket = io(environment.servidor);
    this.socket.emit ('conectarDash', profesorId);
  }

  public Desonectar(profesorId: number) {
    this.socket.emit ('desconectarDash', profesorId);
  }

  public RecordarContrasena(profesor: Profesor) {
    console.log ('dentro del servicio para recordar contraseña');
    // Me conecto momentaneamente para enviarle al servidor la contraseña que debe enviar por email
    this.socket = io(environment.servidor);
    this.socket.emit ('recordarContraseña' , {email: profesor.email, nombre: profesor.NombreUsuario, contrasena: profesor.Password});
    // Me desconecto
    this.socket.emit('forceDisconnect');
  }

}


