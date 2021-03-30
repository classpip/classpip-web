import { Profesor } from './../../clases/Profesor';
import { SesionService } from 'src/app/services/sesion.service';
import { AuthService } from './../../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';

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

  constructor(private auth: AuthService, private sesion: SesionService) { }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()) {
      this.isToken = true;
      this.profesor = this.sesion.DameProfesor();
    }
    else this.isToken = false;

    this.sesion.getObservable().subscribe((data: any) => {
      if(data.topic == "newLogin"){
        this.isToken = true;
        this.profesor = this.sesion.DameProfesor();
      }
      console.log("profesor ", this.profesor);
    });

    console.log("jej: ", this.profesor);
  }
}