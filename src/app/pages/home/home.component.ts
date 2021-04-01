import { SesionService } from 'src/app/services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isCollapsed = true;
  profesor: Profesor = null;
  constructor(private auth: AuthService, private sesion: SesionService) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");

    if(this.auth.isLoggedIn()){
      this.profesor = this.sesion.DameProfesor();
    }
  }

  goJuegoRapido(){
    //Sustituir por url cuando este classpip express disponible
    window.open('http://147.83.118.92:8100/home');
  }

}
