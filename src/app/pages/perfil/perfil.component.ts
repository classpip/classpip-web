import { User } from './../../clases/User';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { SesionService } from './../../services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalContainerComponent } from 'ngx-bootstrap/modal';
import { EmailValidator } from '@angular/forms';
import { reduce } from 'rxjs/operators';

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
      console.log("profesor onInit", this.profesor);
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
      this.auth.login({ "username": this.user.username, "password": this.oldPassword }).subscribe((data: any) => {
        sessionStorage.setItem('ACCESS_TOKEN', data.id);
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
  
  editUser(){
    (<HTMLInputElement>document.getElementById("name")).readOnly = false;
    (<HTMLInputElement>document.getElementById("surname")).readOnly = false;
    (<HTMLInputElement>document.getElementById("surname2")).readOnly = false;
    (<HTMLInputElement>document.getElementById("email")).readOnly = false;
    (<HTMLInputElement>document.getElementById("username")).readOnly = false;
  }

  @ViewChild('modalSecurity', { static: true }) modalSecurity: ModalContainerComponent;

  updateUser(){
    console.log('prof1: ',this.profesor);
    console.log('user1: ', this.user);
    let form = document.forms["userData"];
    let secForm = document.forms['securityForm'];
    let pswd = secForm['pswd'].value;

    if(pswd != ''){

      if(document.getElementById('pswd').style.borderColor == "red"){
        document.getElementById('pswd').style.borderColor = "#525f7f";
        document.getElementById('pswdIcon').style.borderColor = "#525f7f";
      }

      if(this.user.username != form["username"].value || this.user.email != form["email"].value){
        this.auth.login({"username":this.user.username, "password": pswd}).subscribe((data) => {
          sessionStorage.setItem('ACCESS_TOKEN', data.id);
          let user = new User(
            form["username"].value,
            form["email"].value,
            pswd
          );
          console.log('user2:', user);
          this.auth.updateUser(this.profesor.userId, user).subscribe((data: any) => {
            console.log('respuesta subir user2: ', data);
            this.user = data;
            if (this.profesor.nombre != form["name"].value || this.profesor.primerApellido != form["surname"].value || this.profesor.segundoApellido != form["surname2"].value){
              let profesor = new Profesor(
                form["name"].value,
                form["surname"].value,
                form["surname2"].value,
                this.profesor.imagenPerfil,
                this.profesor.identificador,
                this.profesor.id,
                this.profesor.userId
              )
              console.log("prof2", profesor);
              this.auth.updateProfesor(this.profesor.id, profesor).subscribe((data: any) =>{
                this.modalSecurity.hide();
                Swal.fire('Success', 'Datos actualizados correctamente', 'success').then(() => {
                  secForm.reset();
                  this.profesor = data;
                  console.log('respuesta subir prof: ',data);
                  console.log('new thisprofesor: ', this.profesor);
                  this.sesion.TomaProfesor(this.profesor);
                });
              }, (error) => {
                console.log(error);
                this.modalSecurity.hide();
                Swal.fire("Error", "No se ha podido actualizar al profesor", "error")
              })
            } else {
              Swal.fire('Success', 'Datos actualizados correctamente', 'success').then(() => {
                secForm.reset();
              });
              this.modalSecurity.hide();
            }
          })
        }, (error) => {
          Swal.fire('Error','Contraseña incorrecta','error');
        });
      }
      else if(this.profesor.nombre != form["name"].value || this.profesor.primerApellido != form["surname"].value || this.profesor.segundoApellido != form["surname2"].value){
        this.auth.login({"username":this.user.username, "password": pswd}).subscribe((data) => {
          sessionStorage.setItem('ACCESS_TOKEN', data.id);
          let profesor = new Profesor(
            form["name"].value,
            form["surname"].value,
            form["surname2"].value,
            this.profesor.imagenPerfil,
            this.profesor.identificador,
            this.profesor.id,
            this.profesor.userId
          )
          console.log("prof2", profesor);
          this.auth.updateProfesor(this.profesor.id, profesor).subscribe((data: any) =>{
            this.modalSecurity.hide();
            Swal.fire('Success', 'Datos actualizados correctamente', 'success').then(() => {
              secForm.reset();
              this.profesor = data;
              console.log('respuesta subir prof: ',data);
              console.log('new thisprofesor: ', this.profesor);
              this.sesion.TomaProfesor(this.profesor);
            });
          }, (error) => {
            console.log(error);
            Swal.fire("Error", "No se ha podido actualizar al profesor", "error");
            this.modalSecurity.hide();
          })
        }, (error) => {
          Swal.fire('Error','Contraseña incorrecta','error');
        })
      } else {
        //NO MODIFIED DATA
        Swal.fire("Error", "Cambia al menos el valor de algún campo", "error").then(() => {
          this.modalSecurity.hide();
          secForm.reset();
        });
      }

    } else {
      if(document.getElementById('pswd').style.borderColor != "red"){
        document.getElementById('pswd').style.borderColor = "red";
        document.getElementById('pswdIcon').style.borderColor = "red";
      }
    }
  }

  resetEditUser(){
    this.modalSecurity.hide();
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
