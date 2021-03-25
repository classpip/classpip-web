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
  focus;
  focus1;
  focus2;

  profesor: Profesor;
  nombre: string;
  pass: string;

  primerApellido: string;
  segundoApellido: string;
  username: string;
  email: string;
  contrasena: string;
  contrasenaRepetida: string;
  mostrarLogin = true;


  constructor(private authService: AuthService) {}
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

  Registrar() {
    this.authService.BuscaNombreUsuario (this.username)
    .subscribe ( res => {
      if (res[0] !== undefined) {
        Swal.fire('Error', 'Ya existe alguien con el mismo nombre de usuario en Classpip', 'error');

      } else {
        if (this.contrasena !== this.contrasenaRepetida) {
          Swal.fire('Error', 'No coincide la contraseña con la contraseña repetida', 'error');
        } else if (!this.ValidaEmail (this.email)) {
          Swal.fire('Error', 'El email no es correcto', 'error');
        } else {
          // creamos un identificador aleatorio de 5 digitos
          const identificador = Math.random().toString().substr(2, 5);
          const profesor = new Profesor (
          this.nombre,
          this.primerApellido,
          this.segundoApellido,
          this.username,
          this.email,
          this.contrasena,
          null,
          identificador
          );
          this.authService.RegistraProfesor (profesor)
          .subscribe (
              // tslint:disable-next-line:no-shadowed-variable
              (res) => Swal.fire('OK', 'Registro completado con éxito', 'success'),
              (err) => Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error')
          );
        }
        this.nombre = undefined;
        this.contrasena = undefined;
        this.mostrarLogin = true;
      }

    });
  }
  ValidaEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
