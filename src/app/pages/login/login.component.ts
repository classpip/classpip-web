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
  savePass = false;
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
      this.redirectTo = params.redirectTo;
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
    console.log('save pass: ', this.savePass);

    let credentials = {
      "username": this.nombre,
      "password": this.pass
    }
    this.authService.login(credentials).subscribe((token) => {
      console.log('login response: ', token);
      if(!this.savePass){
        this.authService.setAccessToken(token.id);
      } else {
        this.authService.setLocalAccessToken(token.id);
      }
      this.authService.getProfesor(token.userId).subscribe((data) => {
        console.log('PROFESOR LOGUEADO: ', data);
        this.profesor = data[0];
        this.sesion.EnviaProfesor(this.profesor);
        console.log('redirect to: ', this.redirectTo);
        this.redirect();
      }, (err) => {
        console.log(err);
        Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
      })
    }, (err) => {
      console.log(err);
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
    });
  }

  redirect(){
    if(this.redirectTo == 'recursos'){
      this.route.navigateByUrl('/recursos');
    } else if (this.redirectTo == 'experiencias'){
      this.route.navigateByUrl('/experiencias');
    } else {
      this.route.navigateByUrl('/home');
    }
  }
}
