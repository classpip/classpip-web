import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SesionService } from 'src/app/services/sesion.service';
import { ComServerService } from 'src/app/services/com-server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  focus;
  focus1;
  focus2;

  pass;
  nombre;
  profesor;
  
  constructor(private authService: AuthService, private route: Router, private sesion: SesionService,
    private comServer: ComServerService, ) {}
  
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

  logIn() {
    //mirar ngx-loading o alguna otra cosa para mostrar el cargando
    this.nombre = (<HTMLInputElement>document.getElementById('nombre')).value
    this.pass = (<HTMLInputElement>document.getElementById('pass')).value

    console.log ('voy a autentificar a: ' + this.nombre + ' ' + this.pass);
    this.authService.dameProfesor(this.nombre, this.pass)
    .subscribe(
      (res) => {
        console.log("res: ", res);
        if (res[0] !== undefined) {
          console.log ('autoenticicado correctamente');
          this.profesor = res[0]; // Si es diferente de null, el profesor existe y lo meto dentro de profesor
          // Notifico el nuevo profesor al componente navbar
          this.sesion.EnviaProfesor(this.profesor);
          this.comServer.Conectar(this.profesor.id);

          // En principio, no seria necesario enviar el id del profesor porque ya
          // tengo el profesor en la sesión y puedo recuperarlo cuando quiera.
          // Pero si quitamos el id hay que cambiar las rutas en app-routing
          // De momento lo dejamos asi.
          console.log ('vamos inicio');
          // this.route.navigate (['/inicio/' + this.profesor.id]);
        } else {
          // Aqui habría que mostrar alguna alerta al usuario
          console.log('profe no existe');
          Swal.fire('Cuidado', 'Usuario o contraseña incorrectos', 'warning');
        }
      },
      (err) => {
        console.log ('ERROR');
        Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
      }
    );
  }
}
