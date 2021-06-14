import { User } from './../../clases/User';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { SesionService } from './../../services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalContainerComponent } from 'ngx-bootstrap/modal';

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
  repeatPassword: string;

  constructor(private sesion: SesionService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.profesor = this.sesion.DameProfesor();
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
    let form = document.forms['pswdForm'];
    let cont = 0;

    if (form['old'].value != '') {
      if (document.getElementById('old').style.borderColor == "red"){
        document.getElementById('old').style.borderColor = "#525f7f";
        document.getElementById('oldIcon').style.borderColor = "#525f7f";
      }
      this.oldPassword = form['old'].value;
      cont++;
    } else {
      document.getElementById('old').style.borderColor = "red";
      document.getElementById('oldIcon').style.borderColor = "red";
    }

    if (form['new'].value != '') {
      if (document.getElementById('new').style.borderColor == "red"){
        document.getElementById('new').style.borderColor = "#525f7f";
        document.getElementById('newIcon').style.borderColor = "#525f7f";
      }
      this.newPassword = form['new'].value;
      cont++;
    } else {
      document.getElementById('new').style.borderColor = "red";
      document.getElementById('newIcon').style.borderColor = "red";
    }

    if (form['repeat'].value != '') {
      if (document.getElementById('repeat').style.borderColor == "red"){
        document.getElementById('repeat').style.borderColor = "#525f7f";
        document.getElementById('repeatIcon').style.borderColor = "#525f7f";
      }
      this.repeatPassword = form['repeat'].value;
      cont++;
    } else {
      document.getElementById('repeat').style.borderColor = "red";
      document.getElementById('repeatIcon').style.borderColor = "red";
    }

    console.log("Old", this.oldPassword)
    console.log("New", this.newPassword)
    console.log("New2", this.repeatPassword)

    if(cont == 3){
      console.log('username: ', this.user.username);
      this.auth.login({ "username": this.user.username, "password": this.oldPassword }).subscribe(() => {
        if (this.newPassword == this.repeatPassword){
          if(this.oldPassword != this.newPassword) {
            this.auth.changePassword(this.oldPassword, this.newPassword).subscribe(() => {
              Swal.fire('Success', 'Contraseña cambiada con éxito', 'success').then(() => {
                this.resetPswdForm();
              })
            });
          } else {
            Swal.fire('Error', 'La nueva contraseña es igual que la actual', 'error');
            document.getElementById('new').style.borderColor = "red";
            document.getElementById('newIcon').style.borderColor = "red";
            document.getElementById('old').style.borderColor = "red";
            document.getElementById('oldIcon').style.borderColor = "red";
          }
        }
        else {
          Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
          document.getElementById('new').style.borderColor = "red";
          document.getElementById('newIcon').style.borderColor = "red";
          document.getElementById('repeat').style.borderColor = "red";
          document.getElementById('repeatIcon').style.borderColor = "red";
        }
      }, (error) => {
        console.log(error);
        Swal.fire('Error', 'La contraseña introducida no coincide con la actual', 'error');
        document.getElementById('old').style.borderColor = "red";
        document.getElementById('oldIcon').style.borderColor = "red";
      })
    }

  }


  //Obtenemos el componente modal para poder cerrarlo desde aquí
  @ViewChild('modalChangePassword', { static: true }) modalPswd: ModalContainerComponent;

  resetPswdForm(){
    let form = document.forms['pswdForm'];
    form['old'].type = 'password';
    form['new'].type = 'password';
    form['repeat'].type = 'password';

    document.getElementById('new').style.borderColor = "#525f7f";
    document.getElementById('newIcon').style.borderColor = "#525f7f";
    document.getElementById('old').style.borderColor = "#525f7f";
    document.getElementById('oldIcon').style.borderColor = "#525f7f";
    document.getElementById('repeat').style.borderColor = "#525f7f";
    document.getElementById('repeatIcon').style.borderColor = "#525f7f";

    form.reset();
    this.modalPswd.hide();
  }



}
