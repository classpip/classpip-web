import { ImagenesService } from './../../services/imagenes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { SesionService } from './../../services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalContainerComponent } from 'ngx-bootstrap/modal';
import { EmailValidator } from '@angular/forms';
import { reduce } from 'rxjs/operators';
import * as URL from 'src/app/URLs/urls'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  profesor: Profesor;
  isOwner = false;
  enableEdition = false;

  oldPassword: string;
  newPassword: string;
  repeatPassword: string;

  imgProfesor: FormData;

  urlImagenProfesor = URL.ImagenProfesor;

  constructor(private sesion: SesionService, private auth: AuthService, private router: Router, private imgService: ImagenesService, private url: ActivatedRoute) { }

  ngOnInit(): void {

    let id = this.url.snapshot.params.id;

    if (this.auth.isLoggedIn()) {
      let userLogged = this.sesion.getProfesor();
      if (userLogged.id == id) {
        this.isOwner = true;
        this.profesor = userLogged;
      } else {
        this.auth.getProfesor(id).subscribe((data: any) => {
          this.profesor = data[0];
          console.log('profe: ', this.profesor);
        });
      }
    } else {
      this.auth.getProfesor(id).subscribe((data: any) => {
        this.profesor = data[0];
        console.log('profe: ', this.profesor);
      });
    }
  }

  logout() {
    if (this.auth.isLoggedIn()) {
      this.auth.logout().subscribe(() => {
        this.sesion.publish("logout");
        this.profesor = undefined;
        if(sessionStorage.getItem("ACCESS_TOKEN") != null){
          sessionStorage.removeItem("ACCESS_TOKEN");
        } else {
          localStorage.removeItem("ACCESS_TOKEN");
        }
        this.router.navigateByUrl("/#/home");
      });
    }
  }

  goHome() {
    this.router.navigateByUrl('/#/home');
  }

  changePassword() {
    let form = document.forms['pswdForm'];
    let cont = 0;

    if (form['old'].value != '') {
      if (document.getElementById('old').style.borderColor == "red") {
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
      if (document.getElementById('new').style.borderColor == "red") {
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
      if (document.getElementById('repeat').style.borderColor == "red") {
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

    if (cont == 3) {
      console.log('username: ', this.profesor.username);
      this.auth.login({ "username": this.profesor.username, "password": this.oldPassword }).subscribe((data: any) => {
        sessionStorage.setItem('ACCESS_TOKEN', data.id);
        if (this.newPassword == this.repeatPassword) {
          if (this.oldPassword != this.newPassword) {
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

  @ViewChild('modalSecurity', { static: true }) modalSecurity: ModalContainerComponent;

  updateUser() {
    console.log('prof1: ', this.profesor);
    let form = document.forms["userData"];
    let secForm = document.forms['securityForm'];
    let pswd = secForm['pswd'].value;

    if (pswd != '') {

      if (document.getElementById('pswd').style.borderColor == "red") {
        document.getElementById('pswd').style.borderColor = "#525f7f";
        document.getElementById('pswdIcon').style.borderColor = "#525f7f";
      }

      if (this.profesor.username != form["username"].value || this.profesor.email != form["email"].value || this.profesor.nombre != form["name"].value ||
          this.profesor.primerApellido != form["surname"].value || this.profesor.segundoApellido != form["surname2"].value) {

        if (this.profesor.username != form["username"].value || this.profesor.email != form["email"].value) {
    
          this.auth.checkUsername(form["username"].value).subscribe((data: any) => {
            if(data.length == 0){
              this.auth.checkEmail(form["email"].value).subscribe((email: any) => {
                if(email.length == 0){
                  this.auth.login({ "username": this.profesor.username, "password": pswd }).subscribe((data) => {
                    sessionStorage.setItem('ACCESS_TOKEN', data.id);
        
                    let profesor = new Profesor(
                      form["username"].value,
                      form["email"].value,
                      pswd,
                      form["name"].value,
                      form["surname"].value,
                      form["surname2"].value,
                      this.profesor.imagenPerfil,
                      this.profesor.identificador,
                      this.profesor.id
                    );
                    console.log("prof2", profesor);
        
                    this.auth.updateProfesor(this.profesor.id, profesor).subscribe((data: any) => {
                      this.modalSecurity.hide();
                      Swal.fire('Success', 'Datos actualizados correctamente', 'success').then(() => {
                        secForm.reset();
                        this.profesor = data;
                        console.log('respuesta subir prof: ', data);
                        console.log('new thisprofesor: ', this.profesor);
                        this.sesion.TomaProfesor(this.profesor);
                        this.enableEdition = false;
                      });
                    }, (error) => {
                      console.log(error);
                      this.modalSecurity.hide();
                      Swal.fire("Error", "No se ha podido actualizar al profesor", "error")
                    })
                  }, (error) => {
                    console.log(error);
                    if (document.getElementById('pswd').style.borderColor != "red") {
                      document.getElementById('pswd').style.borderColor = "red";
                      document.getElementById('pswdIcon').style.borderColor = "red";
                    }
                    Swal.fire('Error', 'Contraseña incorrecta', 'error');
                  });
                } else {
                  Swal.fire("Error", "El correo introducido ya existe", "error").then(() => {
                    this.modalSecurity.hide();
                    secForm.reset();
                  });
                }
              })
            } else {
              Swal.fire("Error", "El nombre de usuario introducido ya existe", "error").then(() => {
                this.modalSecurity.hide();
                secForm.reset();
              });
            }
          })
        } else {
          
          if (document.getElementById('pswd').style.borderColor == "red") {
            document.getElementById('pswd').style.borderColor = "#525f7f";
            document.getElementById('pswdIcon').style.borderColor = "#525f7f";
          }

          this.auth.login({ "username": this.profesor.username, "password": pswd }).subscribe((data) => {
            sessionStorage.setItem('ACCESS_TOKEN', data.id);

            let profesor = new Profesor(
              form["username"].value,
              form["email"].value,
              pswd,
              form["name"].value,
              form["surname"].value,
              form["surname2"].value,
              this.profesor.imagenPerfil,
              this.profesor.identificador,
              this.profesor.id
            );
            console.log("prof2", profesor);

            this.auth.updateProfesor(this.profesor.id, profesor).subscribe((data: any) => {
              this.modalSecurity.hide();
              Swal.fire('Success', 'Datos actualizados correctamente', 'success').then(() => {
                secForm.reset();
                this.profesor = data;
                console.log('respuesta subir prof: ', data);
                console.log('new thisprofesor: ', this.profesor);
                this.sesion.TomaProfesor(this.profesor);
                this.enableEdition = false;
              });
            }, (error) => {
              console.log(error);
              this.modalSecurity.hide();
              Swal.fire("Error", "No se ha podido actualizar al profesor", "error")
            })
          }, (error) => {
            console.log(error);
            if (document.getElementById('pswd').style.borderColor != "red") {
              document.getElementById('pswd').style.borderColor = "red";
              document.getElementById('pswdIcon').style.borderColor = "red";
            }
            Swal.fire('Error', 'Contraseña incorrecta', 'error');
          });
        }     
      } else {
        //NO MODIFIED DATA
        Swal.fire("Error", "Cambia al menos el valor de algún campo", "error").then(() => {
          this.modalSecurity.hide();
          secForm.reset();
        });
      }
    }
  }

  resetEditUser() {
    this.modalSecurity.hide();
  }

  //Obtenemos el componente modal para poder cerrarlo desde aquí
  @ViewChild('modalChangePassword', { static: true }) modalPswd: ModalContainerComponent;

  resetPswdForm() {

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

  changeProfileImage() {
    this.imgService.uploadImgProfesor(this.imgProfesor).subscribe((data: any) => {
      console.log('respuesta upload img: ', data);
      if (data != null) {
        console.log("profesor", this.profesor)
        this.auth.updateUserImage(this.profesor.id, this.profesor).subscribe((data) => {
          console.log("DATAAAAAA:", data);
          Swal.fire('Hecho!', 'Foto de perfil cambiada con éxito', 'success').then(() => {
          })
        })

      }
    }, (error) => {
      console.log(error);
      Swal.fire('Error', 'Error al subir imagen', 'error');
    });
  }

  async getImagenPerfil($event) {

    console.log($event.target.files[0]);
    let img = $event.target.files[0];

    this.imgService.checkImgNameDuplicated('ImagenProfesor', img.name).subscribe((data) => {
      console.log('API file: ', data);
      this.imgProfesor = null;
      Swal.fire('Error', 'La imagen ' + img.name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
    }, (notFound) => {
      console.log('Se puede subir ', img.name);
      this.imgProfesor = new FormData();
      this.imgProfesor.append(img.name, img);
      this.profesor.imagenPerfil = img.name;
      this.changeProfileImage();
    });

    console.log(this.profesor.imagenPerfil);
  }

  activarInputImagen(inputId: string) {
    document.getElementById(inputId).click();
  }


}
