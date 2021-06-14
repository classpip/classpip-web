import { User } from './../../clases/User';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { SesionService } from './../../services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  profesor: Profesor;
  user: User;

  oldPassword: string;
  newPassword: string;
  reperatPassword: string;

  constructor(private sesion: SesionService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.profesor = this.sesion.DameProfesor();
      console.log('img: ', this.profesor.imagenPerfil);
      console.log("prof", this.profesor);
      this.auth.getUser(this.profesor.userId).subscribe((res) => {
        this.user = res;
      });
    }
    else this.router.navigateByUrl('/#/home');

  }

  logout() {
    if (this.auth.isLoggedIn()) {
      this.profesor = undefined;
      sessionStorage.removeItem("ACCESS_TOKEN");
      this.router.navigateByUrl("/#/home");
    }
  }

  goHome() {
    this.router.navigateByUrl('/#/home');
  }

  changePassword() {
    this.oldPassword = (<HTMLInputElement>document.getElementById('old')).value
    this.newPassword = (<HTMLInputElement>document.getElementById('new')).value
    this.reperatPassword = (<HTMLInputElement>document.getElementById('repeat')).value

    console.log("Old", this.oldPassword)
    console.log("New", this.newPassword)
    console.log("New2", this.reperatPassword)



    this.auth.login({ "username": this.user.username, "password": this.oldPassword }).subscribe(() => {
      if (this.newPassword == this.reperatPassword && this.oldPassword != this.newPassword) {
        this.auth.changePassword(this.oldPassword, this.newPassword).subscribe(() => {
          Swal.fire('Success', 'Contraseña cambiada con éxito', 'success');
        })
      }
      else {
        Swal.fire('Error', 'La nueva contraseña no coincide o es igual que la actual', 'error');
      }
    }, (error) => {
      console.log(error);
      Swal.fire('Error', 'La contraseña introducida no coincide con la actual', 'error');
    })




  }



}
