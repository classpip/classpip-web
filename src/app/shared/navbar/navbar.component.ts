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
      this.sesion.EnviameProfesor().subscribe(profesor => {
        if(profesor != null){
          this.profesor = profesor;
          this.sesion.TomaProfesor(this.profesor);
          this.isToken = true;
          this.urlPerfil = "/perfil/" + this.profesor.id;
        }
      })
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
    });
  }

  //Función para volver a la página de recursos
  volver(){
    this.router.navigateByUrl('/recursos');
  }

  

}