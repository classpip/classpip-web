import { Router } from '@angular/router';
import { SesionService } from 'src/app/services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  focus1;
  focus2;
  focus3;
  focus4;
  focus5;
  focus6;

  profesor: Profesor;
  nombre: string;
  password: string;

  primerApellido: string;
  segundoApellido: string;
  username: string;
  email: string;
  contrasena: string;
  contrasenaRepetida: string;
  mostrarLogin = true;


  constructor(private authService: AuthService, private sesion: SesionService,
    private route: Router) { }
  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e) {
    var squares1 = document.getElementById("square1");
    var squares2 = document.getElementById("square2");
    var squares3 = document.getElementById("square3");
    var squares4 = document.getElementById("square4");
    var squares5 = document.getElementById("square5");
    var squares6 = document.getElementById("square6");
    var squares7 = document.getElementById("square7");
    var squares8 = document.getElementById("square8");

    var posX = e.clientX - window.innerWidth / 2;
    var posY = e.clientY - window.innerWidth / 6;

    squares1.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares2.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares3.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares4.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares5.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares6.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares7.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)";
    squares8.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)";
  }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");

    this.onMouseMove(event);
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
  }

  register() {

    this.username = (<HTMLInputElement>document.getElementById('username')).value
    this.password = (<HTMLInputElement>document.getElementById('password')).value
    this.primerApellido = (<HTMLInputElement>document.getElementById('primerApellido')).value
    this.segundoApellido = (<HTMLInputElement>document.getElementById('segundoApellido')).value
    this.email = (<HTMLInputElement>document.getElementById('email')).value
    this.nombre = (<HTMLInputElement>document.getElementById('nombre')).value


    console.log(this.username, this.nombre, this.primerApellido, this.segundoApellido, this.email, this.password)
    /* if (this.contrasena !== this.contrasenaRepetida) {
      Swal.fire('Error', 'No coincide la contraseña con la contraseña repetida', 'error');
    } else  */
    if (!this.validaEmail(this.email)) {
      Swal.fire('Error', 'El email no es correcto', 'error');
    } else {
      this.authService.checkUsername(this.username).subscribe((username: any) => {
        if(username.length == 0){
          this.authService.checkEmail(this.email).subscribe((email: any) => {
            if(email.length == 0){
              // creamos un identificador aleatorio de 5 digitos
              const identificador = Math.random().toString().substr(2, 5);
              const newProf = new Profesor(
                this.username,
                this.email,
                this.password,
                this.nombre,
                this.primerApellido,
                this.segundoApellido,
                null,
                identificador
              );
              console.log('new prof: ', newProf);
              this.authService.register(newProf).subscribe((prof: any) => {
                console.log('prof response', prof);
                this.profesor = prof;
                let credentials = {
                  "username": this.username,
                  "password": this.password
                }
                this.authService.login(credentials).subscribe((token) => {
                  this.authService.setAccessToken(token.id);
                  this.sesion.EnviaProfesor(this.profesor);
                  Swal.fire('OK', 'Registro completado con éxito', 'success').then(() => {
                    this.route.navigateByUrl('/#/home');
                  });
                }, (err) => {
                  console.log(err);
                  Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
                })
              }, (err) => {
                console.log(err);
                Swal.fire('Error', 'Fallo en el registro, prueba de nuevo más tarde', 'error');
              });
            } else {
              Swal.fire('Error', 'Este email ya está registrado', 'error');
            }
          });
        } else {
          Swal.fire('Error', 'Ya existe un profesor con este nombre de usuario', 'error');
        }
      }, (error) => {
        Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
      })
    }
  }

  validaEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

}
