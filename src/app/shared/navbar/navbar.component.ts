import { Router } from '@angular/router';
import { Profesor } from './../../clases/Profesor';
import { SesionService } from 'src/app/services/sesion.service';
import { AuthService } from './../../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import * as URL from 'src/app/URLs/urls'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  collapse;
  isCollapsed = true;
  profesor: Profesor;
  isToken: boolean;
  urlImagenProfesor = URL.ImagenProfesor;
  urlPerfil: string;

  constructor(private auth: AuthService, private sesion: SesionService, private router: Router) { }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()) {
      this.isToken = true;
      this.profesor = this.sesion.getProfesor();
      this.urlPerfil = "/perfil/" + this.profesor.id;
      if(this.profesor == undefined) {
        sessionStorage.removeItem("ACCESS_TOKEN");
        this.isToken = false;
      }
    }
    else this.isToken = false;

    this.sesion.getObservable().subscribe((data: any) => {
      if(data.topic == "newLogin"){
        this.isToken = true;
        this.profesor = this.sesion.getProfesor();
      } else if(data.topic == "logout"){
        this.isToken = false;
        this.profesor = undefined;
      }
      console.log("profesor ", this.profesor);
    });

    console.log("profesor: ", this.profesor);
  }

  //Función para volver a la página de recursos
  volver(){
    this.router.navigateByUrl('/recursos');
  }

  

}