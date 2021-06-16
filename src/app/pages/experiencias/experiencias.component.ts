import { Publicacion } from './../../clases/Publicacion';
import { Comentario } from './../../clases/Comentario';
import { SesionService } from './../../services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { AuthService } from './../../services/auth.service';
import { PublicacionesService } from './../../services/publicaciones.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ModalContainerComponent } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-experiencias',
  templateUrl: './experiencias.component.html',
  styleUrls: ['./experiencias.component.scss']
})
export class ExperienciasComponent implements OnInit {

  isCollapsed = true;
  focus1;
  focus2;

  //Variables para ver publicaciones
  publicaciones;
  mapPublicaciones = new Map<String, Publicacion>();
  comments;

  //Variables para subir publicaciones
  isLogged;
  profesor;
  sndbtn;

  //Variables para subir ficheros
  files: FormData;
  fileNames = new Array<string>();
  mapFiles = new Map<string, FormData>();

  //Variables para subir imágenes
  imgs: FormData;
  imgNames = new Array<string>();
  mapImgs = new Map<string, FormData>();

  constructor(private auth: AuthService, private publiService: PublicacionesService, private sesion: SesionService, private imgService: ImagenesService) { }

  ngOnInit(): void {
    //Comprueba si el usuario esta loggeado
    if (this.auth.isLoggedIn()) {
      this.isLogged = true;
      this.profesor = this.sesion.DameProfesor();
      if (this.profesor == undefined) {
        sessionStorage.removeItem("ACCESS_TOKEN");
        this.isLogged = false;
      }
    }
    else this.isLogged = false;

    //Obtiene las publicaciones para mostrarlas
    this.publiService.damePublicaciones().subscribe(data => {
      console.log('publicaciones: ' + data);
      if (data != undefined) {
        this.publicaciones = data;
        //Ordena de más reciente a más antigua
        this.publicaciones.sort(function (a, b) {
          // A va primero que B
          if (a.fecha < b.fecha)
            return 1;
          // B va primero que A
          else if (a.fecha > b.fecha)
            return -1;
          // A y B son iguales
          else
            return 0;
        });

        this.publicaciones.forEach(publi => {
          //Formatea la fecha
          publi.fecha = moment(publi.fecha).lang('es').fromNow();

          //Mira si el user le ha dado like
          publi.likes.forEach(like => {
            console.log('like: ' + like.userId);
            publi.isLike = false;
            if (this.profesor != undefined) {
              if (like.userId === this.profesor.userId) {
                publi.isLike = true;
              }
            }
            else {
              publi.isLike = false;
            }
          });

          //Obtiene comentarios de las publicaciones
          this.publiService.dameComentariosPubli(publi.id).subscribe((comments) => {
            if (comments != undefined) {
              publi.comentarios = comments;
              comments.forEach(comm => {
                //Formatea fecha comentario
                comm.fecha = moment(comm.fecha).lang('es').fromNow();
                //Obtiene quien ha escrito el comentario
                this.publiService.dameAutorComentario(comm.id).subscribe((autor) => {
                  if (autor != undefined) {
                    comm.autor = autor;
                  }
                });
                if(this.profesor != undefined){
                  comm.isPropietario = this.isPropietarioComment(comm)
                }
                console.log("Comentario",comm)
              });
            };
          });
          //Comprueba si soy el propietario
          if (this.profesor != undefined) {
            publi.isPropietario = this.isPropietarioPubli(publi);
          }
        });
      }
    });
  }

  /* *********************************** */
  /****** FUNCIONES PUBLICACIONES ********/
  /* *********************************** */
  sendPubli() {

    let form = document.forms['newPubliForm'];
    let titulo: string;
    let experiencia: string;

    if(form['titulo'].value != ''){
      if(document.getElementById('titulo').style.borderColor == 'red'){
        document.getElementById('titulo').style.borderColor = '#525f7f';
      }
      titulo = form['titulo'].value;
    } else {
      document.getElementById('titulo').style.borderColor = 'red';
    }
    

    if(form['experiencia'].value != ''){
      if(document.getElementById('experiencia').style.borderColor == 'red'){
        document.getElementById('experiencia').style.borderColor = '#525f7f';
      }
      experiencia = form['experiencia'].value;
    } else {
      document.getElementById('experiencia').style.borderColor = 'red';
    }

    const today = new Date().toISOString();
    console.log(today);

    if(this.mapImgs.size == 0 && this.mapFiles.size == 0){
      //SUBIR PUBLI SIN ARCHIVOS
      let publi = new Publicacion(titulo, experiencia, today, this.profesor.id, [], []);
      console.log('publi: ', publi)
  
      this.publiService.publicar(publi).subscribe((data) => {
        console.log(data);
        Swal.fire('Success','Experiencia publicada! Muchas gracias.', 'success').then(() => {
          this.resetFormNewPubli();
          data.autor = this.profesor;
          data.fecha = moment(data.fecha).lang('es').fromNow();
          data.likes = [];
          this.publicaciones.unshift(data);
        })
      }, (error) => {
        Swal.fire('Error', 'Error al subir experiencia', 'error');
      })
    } else {
      //SUBIR PUBLI CON ARCHIVOS
      let publi = new Publicacion(titulo, experiencia, today, this.profesor.id, [], [], this.fileNames, this.imgNames);
      console.log('publi: ', publi)
  
      this.publiService.publicar(publi).subscribe((newPubli) => {
        console.log('respuesta upload publi: ', newPubli);
        if(this.mapImgs.size > 0 && this.mapFiles.size > 0){

          let contImg = 0;
          let contFile = 0;

          for(let file of this.mapFiles.values()){
            this.imgService.uploadFilePublicacion(file).subscribe((fileData) => {
              console.log('respuesta subir ficheros: ', fileData);
              contFile++;
              if(contFile == this.mapFiles.size){
                for(let img of this.mapImgs.values()){
                  this.imgService.uploadImgPublicacion(img).subscribe((imgData) => {
                    console.log('respuesta subir imagenes: ', imgData);
                    contImg++;
                    if(contImg == this.mapImgs.size){
                      this.resetFormNewPubli();
                      Swal.fire('Success', 'Experiencia publicada! Muchas gracias.', 'success').then(() => {
                        newPubli.autor = this.profesor;
                        newPubli.fecha = moment(newPubli.fecha).lang('es').fromNow();
                        newPubli.likes = [];
                        this.publicaciones.unshift(newPubli);
                      });
                    }
                  }, (error) => {
                    Swal.fire('Error','Error al subir imágenes', 'error').then(() => {
                      this.publiService.deletePubli(newPubli.id.toString());
                    });
                  });
                }
              } 
            }, (error) => {
              Swal.fire('Error','Error al subir ficheros', 'error').then(() => {
                this.publiService.deletePubli(newPubli.id.toString());
              })
            })
          }

        } else if(this.mapFiles.size > 0) {
          let cont = 0;
          for(let file of this.mapFiles.values()){
            this.imgService.uploadFilePublicacion(file).subscribe((fileData) => {
              console.log('respuesta subir ficheros: ', fileData);
              cont++;
              if(cont == this.mapFiles.size){
                this.resetFormNewPubli();
                Swal.fire('Success', 'Experiencia publicada! Muchas gracias.', 'success').then(() => {
                  newPubli.autor = this.profesor;
                  newPubli.fecha = moment(newPubli.fecha).lang('es').fromNow();
                  newPubli.likes = [];
                  this.publicaciones.unshift(newPubli);
                });
              }
            }, (error) => {
              Swal.fire('Error','Error al subir ficheros', 'error').then(() => {
                this.publiService.deletePubli(newPubli.id.toString());
              })
            })
          }
        } else if(this.mapImgs.size > 0){
          let cont = 0;
          for(let img of this.mapImgs.values()){
            this.imgService.uploadImgPublicacion(img).subscribe((imgData) => {
              console.log('respuesta subir imagenes: ', imgData);
              cont++;
              if(cont == this.mapImgs.size){
                Swal.fire('Success', 'Experiencia publicada! Muchas gracias.', 'success').then(() => {
                  newPubli.autor = this.profesor;
                  newPubli.fecha = moment(newPubli.fecha).lang('es').fromNow();
                  newPubli.likes = [];
                  this.publicaciones.unshift(newPubli);
                  this.resetFormNewPubli();
                });
              }
            }, (error) => {
              Swal.fire('Error','Error al subir imágenes', 'error').then(() => {
                this.publiService.deletePubli(newPubli.id.toString());
              });
            });
          }
        } 
      }, (error) => {
        Swal.fire('Error','Error al subir publicacion', 'error');
      });
    }
  }

  @ViewChild('modalNewPubli', { static: true }) modalNewPubli: ModalContainerComponent;
  
  resetFormNewPubli(){
    this.mapFiles = new Map<string,FormData>();
    this.mapImgs = new Map<string,FormData>();
    this.imgNames = new Array<string>();
    this.fileNames = new Array<string>();
    document.forms['newPubliForm'].reset();
    this.modalNewPubli.hide();
  }

  likePubli(publiId: number) {
    let prof = this.profesor;
    prof.publicacionId = publiId;
    prof.id = null;
    this.publiService.likePubli(publiId, this.profesor).subscribe((data: Profesor) => {
      if (data != undefined) {
        this.publicaciones.forEach(publi => {
          if (publi.id == publiId) {
            publi.likes.unshift(data);
            publi.isLike = true;
          }
        });
      }
    });
  }

  dislikePubli(publiId: number) {
    this.publicaciones.forEach(publi => {
      publi.likes.forEach(like => {
        if (publi.id == publiId && like.userId == this.profesor.userId) {
          try {
            this.publiService.dislikePubli(publiId, like.id).subscribe(() => {
              publi.isLike = false;
              publi.likes.splice(publi.likes.indexOf(like), 1);
            });
          } catch (error) {
            console.log("error: ", error);
          }
        }
      })
    });
  }


  /* *********************************** */
  /******* FUNCIONES COMENTARIOS *********/
  /* *********************************** */
  sendComment(publiId: number) {
    console.log('entra send ' + publiId);
    if ((<HTMLInputElement>document.getElementById(publiId.toString())).value.length != 0) {
      const comentario = (<HTMLInputElement>document.getElementById(publiId.toString())).value;
      console.log(comentario);
      (<HTMLInputElement>document.getElementById(publiId.toString())).value = '';

      const today = new Date().toISOString();

      const newComment = { "comentario": comentario, "fecha": today, "likes": 0, "autorId": this.profesor.id, "publicacionId": publiId };
      console.log('new comment: ' + newComment);

      this.publiService.comentar(publiId, newComment).subscribe(data => {
        console.log(data);
        data.autor = this.profesor;
        this.publicaciones.forEach(publi => {
          if (publi.id == publiId) {
            publi.comentarios.unshift(data);
          }
        })
      });
    }
    this.ngOnInit();
  }
  //INTENTO DE DAR LIKE FALLIDO
  /* likeComment(commentId: number){
    this.comments.forEach(comment => {
      comment.likes.forEach(like => {
        if(comment.id == commentId){ 
          try {
            this.publiService.likeComment(comment, commentId).subscribe(() => {
              comment.likes = comment.likes + 1;
            })
          } catch(error) {
            console.log("error: ", error);
          }
        }
      })
    })
  } */

  dislikeComment(commentId: number) {
    this.comments.forEach(comment => {
      comment.likes.forEach(like => {
        if (comment.id == commentId && like.userId == this.profesor.userId) {
          try {
            this.publiService.dislikeComment(commentId, like.id).subscribe(() => {
              comment.isLike = false;
              comment.likes.splice(comment.likes.indexOf(like), 1);
            });
          } catch (error) {

          }
        }
      })
    });
  }

  /* *********************************** */
  /****** FUNCIONES SUBIR ARCHIVOS *******/
  /* *********************************** */
  activarInput(id) {
    document.getElementById(id).click();
  }

  async getImagen($event) {
    let files = $event.target.files;
    let APIfileNames;

    await this.imgService.getFileNamesContainer('ImagenesPublicacion').subscribe((data: Array<any>) => {
      console.log('API files: ', data);
      if(data != null){
        APIfileNames = data;
        for(let i=0; i < files.length; i++){
          let filter = APIfileNames.find(f => f.name === files[i].name);
          if(filter != null){
            Swal.fire('Error', 'El fichero '+files[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
            break;
          } else {
            console.log('Se puede subir ', files[i].name);
            if(!this.mapImgs.has(files[i].name)){
              this.mapImgs.set(files[i].name, new FormData());
              this.mapImgs.get(files[i].name).append(files[i].name, files[i]);
              this.imgNames.push(files[i].name);
            }
          }
        }
      }
    });
  }

  async getFiles($event) {
    let files = $event.target.files;
    let APIfileNames;

    await this.imgService.getFileNamesContainer('FicherosPublicacion').subscribe((data: Array<any>) => {
      console.log('API files: ', data);
      if(data != null){
        APIfileNames = data;
        for(let i=0; i < files.length; i++){
          let filter = APIfileNames.find(f => f.name === files[i].name);
          if(filter != null){
            Swal.fire('Error', 'El fichero '+files[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
            break;
          } else {
            console.log('Se puede subir ', files[i].name);
            if(!this.mapFiles.has(files[i].name)){
              this.mapFiles.set(files[i].name, new FormData());
              this.mapFiles.get(files[i].name).append(files[i].name, files[i]);
              this.fileNames.push(files[i].name);
            }
          }
        }
      }
    });
  }

  unselectFile(type: string, name: string){
    switch(type){
      case 'img': {
        this.mapImgs.delete(name);
        this.imgNames.splice(this.imgNames.indexOf(name), 1);
        break;
      }
      case 'file': {
        this.mapFiles.delete(name);
        this.fileNames.splice(this.fileNames.indexOf(name), 1);
        break;
      }
    }
  }

  /* *********************************** */
  /******** FUNCIONES ELIMINAR ***********/
  /* *********************************** */
  
  //Función para ver si soy el propietario de la publi
  isPropietarioPubli(publi) {
    console.log("this.prof: ", this.profesor.id);
    console.log("recurso.prof: ", publi.autorId);
    if (this.profesor.id == publi.autorId) {
      return true
    }
    else {
      return false
    }
  }

  //Función para ver si soy el propietario del comentario
  isPropietarioComment(comment) {
    console.log("this.prof: ", this.profesor.id);
    console.log("comment.prof: ", comment.autorId);
    if (this.profesor.id == comment.autorId) {
      return true
    }
    else {
      return false
    }
  }

  //Función para borrar publicación
  borrarPublicacion(publi: any){
    
    console.log('Falta eliminar archivos (si tiene)');

    this.publiService.deletePubli(publi.id).subscribe(() => {
      Swal.fire("Hecho", "Publicación eliminada correctamente", "success")
      this.ngOnInit();
    }), (error) => {
      console.log(error);
      Swal.fire("Error", "Error eliminando la publicación", "error");
    }
  }

  //Función para borrar comentario
  borrarComment(comment: any){
    this.publiService.deleteComment(comment.id).subscribe(() => {
      Swal.fire("Hecho", "Comentario eliminado correctamente", "success")
      this.ngOnInit();
    }), (error) => {
      console.log(error);
      Swal.fire("Error", "Error eliminando el comentario", "error");
    }
  }
}
