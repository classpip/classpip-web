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
      this.sesion.EnviameProfesor().subscribe ( profesor => this.profesor = profesor);
    }
  }

  goDown(element){
    element.scrollIntoView({behavior: "smooth"});
  }

}
