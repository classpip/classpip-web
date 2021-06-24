import { Profesor } from './../../clases/Profesor';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy, HostListener, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SesionService } from 'src/app/services/sesion.service';

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

  redirectTo = null;

  pass;
  nombre;
  profesor: Profesor;
  
  constructor(private authService: AuthService, private route: Router, private sesion: SesionService, private actRoute: ActivatedRoute) {}
  
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

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      this.redirectTo = params.redirectTo;
      console.log(this.redirectTo);
    });

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

    let credentials = {
      "username": this.nombre,
      "password": this.pass
    }
    this.authService.login(credentials).subscribe((token) => {
      console.log('login response: ', token);
      this.authService.setAccessToken(token.id);
      this.authService.getProfesor(token.userId).subscribe((data) => {
        console.log('data: ', data);
        this.profesor = data[0];
        this.sesion.EnviaProfesor(this.profesor);
        this.route.navigateByUrl('/#/home');
      }, (err) => {
        console.log(err);
        Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
      })
    }, (err) => {
      console.log(err);
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
    });
  }
}
