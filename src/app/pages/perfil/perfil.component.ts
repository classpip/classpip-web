import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { SesionService } from './../../services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  profesor: Profesor;

  constructor(private sesion: SesionService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()){
      this.profesor = this.sesion.DameProfesor();
      console.log('img: ', this.profesor.ImagenPerfil);
    }
    else this.router.navigateByUrl('/#/home');
  }

  logout(){
    if(this.auth.isLoggedIn()){
      this.profesor = undefined;
      sessionStorage.removeItem("ACCESS_TOKEN");
      this.sesion.publish({topic: "logout"});
      this.router.navigateByUrl("/#/home");
    }
  }

  jaja(){
    this.router.navigateByUrl('/#/home');
  }

}
