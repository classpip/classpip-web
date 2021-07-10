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
import { saveAs } from 'file-saver';
import * as URL from 'src/app/URLs/urls'
import * as JSZip from 'jszip';

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
  likes;
  profesores;

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

  //Variables para ver imagenes y ficheros
  filesSeeModal;
  likesSeeModal;

  host = URL.host;
  urlImagenProfesor = URL.ImagenProfesor;

  constructor(private auth: AuthService, private publiService: PublicacionesService, private sesion: SesionService, private imgService: ImagenesService) { }

  ngOnInit(): void {

    //Comprueba si el usuario esta loggeado
    if (this.auth.isLoggedIn()) {
      this.isLogged = true;
      this.profesor = this.sesion.getProfesor();
      console.log('prof1: ', this.profesor);
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
          if(this.profesor != undefined){
            publi.likes.forEach(like => {
              console.log('like: ' + like);
              console.log('profID: ', this.profesor.id)
              publi.isLike = false;
              if (this.profesor != undefined) {
                if (like === this.profesor.id) {
                  publi.isLike = true;
                }
              }
              else {
                publi.isLike = false;
              }
            });
          }

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
                if (this.profesor != undefined) {
                  comm.isPropietario = this.isPropietarioComment(comm)
                }
                console.log("Comentario", comm)
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

    this.auth.getProfesores().subscribe((data) => {
      this.profesores = new Map<Number,Profesor>();
      data.forEach((prof) => {
        this.profesores.set(prof.id, prof);
      })
    })

    this.sesion.getObservable().subscribe((data: any) => {
      if(data.topic == "logged"){
        console.log('entra subscribe');
        this.sesion.EnviameProfesor().subscribe ( profesor => {
          this.profesor = profesor;
          this.publicaciones.forEach(publi => {
            publi.likes.forEach(like => {
              publi.isLike = false;
              if (this.profesor != undefined) {
                if (like === this.profesor.id) {
                  publi.isLike = true;
                }
              }
              publi.isPropietario = this.isPropietarioPubli(publi);
            });
          });
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

    if (form['titulo'].value != '') {
      if (document.getElementById('titulo').style.borderColor == 'red') {
        document.getElementById('titulo').style.borderColor = '#525f7f';
      }
      titulo = form['titulo'].value;
    } else {
      document.getElementById('titulo').style.borderColor = 'red';
    }


    if (form['experiencia'].value != '') {
      if (document.getElementById('experiencia').style.borderColor == 'red') {
        document.getElementById('experiencia').style.borderColor = '#525f7f';
      }
      experiencia = form['experiencia'].value;
    } else {
      document.getElementById('experiencia').style.borderColor = 'red';
    }

    const today = new Date().toISOString();
    console.log(today);

    if (this.mapImgs.size == 0 && this.mapFiles.size == 0) {
      //SUBIR PUBLI SIN ARCHIVOS
      let publi = new Publicacion(titulo, experiencia, today, this.profesor.id, [], []);
      console.log('publi: ', publi)

      this.publiService.publicar(publi).subscribe((data) => {
        console.log(data);
        Swal.fire('Success', 'Experiencia publicada! Muchas gracias.', 'success').then(() => {
          this.resetFormNewPubli();
          data.autor = this.profesor;
          data.fecha = moment(data.fecha).lang('es').fromNow();
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
        if (this.mapImgs.size > 0 && this.mapFiles.size > 0) {

          let contImg = 0;
          let contFile = 0;

          for (let file of this.mapFiles.values()) {
            this.imgService.uploadFilePublicacion(file).subscribe((fileData) => {
              console.log('respuesta subir ficheros: ', fileData);
              contFile++;
              if (contFile == this.mapFiles.size) {
                for (let img of this.mapImgs.values()) {
                  this.imgService.uploadImgPublicacion(img).subscribe((imgData) => {
                    console.log('respuesta subir imagenes: ', imgData);
                    contImg++;
                    if (contImg == this.mapImgs.size) {
                      this.resetFormNewPubli();
                      Swal.fire('Success', 'Experiencia publicada! Muchas gracias.', 'success').then(() => {
                        newPubli.autor = this.profesor;
                        newPubli.fecha = moment(newPubli.fecha).lang('es').fromNow();
                        newPubli.likes = [];
                        this.publicaciones.unshift(newPubli);
                      });
                    }
                  }, (error) => {
                    Swal.fire('Error', 'Error al subir imágenes', 'error').then(() => {
                      this.publiService.deletePubli(newPubli.id.toString());
                    });
                  });
                }
              }
            }, (error) => {
              Swal.fire('Error', 'Error al subir ficheros', 'error').then(() => {
                this.publiService.deletePubli(newPubli.id.toString());
              })
            })
          }

        } else if (this.mapFiles.size > 0) {
          let cont = 0;
          for (let file of this.mapFiles.values()) {
            this.imgService.uploadFilePublicacion(file).subscribe((fileData) => {
              console.log('respuesta subir ficheros: ', fileData);
              cont++;
              if (cont == this.mapFiles.size) {
                this.resetFormNewPubli();
                Swal.fire('Success', 'Experiencia publicada! Muchas gracias.', 'success').then(() => {
                  newPubli.autor = this.profesor;
                  newPubli.fecha = moment(newPubli.fecha).lang('es').fromNow();
                  this.publicaciones.unshift(newPubli);
                });
              }
            }, (error) => {
              Swal.fire('Error', 'Error al subir ficheros', 'error').then(() => {
                this.publiService.deletePubli(newPubli.id.toString());
              })
            })
          }
        } else if (this.mapImgs.size > 0) {
          let cont = 0;
          for (let img of this.mapImgs.values()) {
            this.imgService.uploadImgPublicacion(img).subscribe((imgData) => {
              console.log('respuesta subir imagenes: ', imgData);
              cont++;
              if (cont == this.mapImgs.size) {
                Swal.fire('Success', 'Experiencia publicada! Muchas gracias.', 'success').then(() => {
                  newPubli.autor = this.profesor;
                  newPubli.fecha = moment(newPubli.fecha).lang('es').fromNow();
                  this.publicaciones.unshift(newPubli);
                  this.resetFormNewPubli();
                });
              }
            }, (error) => {
              Swal.fire('Error', 'Error al subir imágenes', 'error').then(() => {
                this.publiService.deletePubli(newPubli.id.toString());
              });
            });
          }
        }
      }, (error) => {
        Swal.fire('Error', 'Error al subir publicacion', 'error');
      });
    }
  }

  @ViewChild('modalNewPubli', { static: true }) modalNewPubli: ModalContainerComponent;

  resetFormNewPubli() {
    this.mapFiles = new Map<string, FormData>();
    this.mapImgs = new Map<string, FormData>();
    this.imgNames = new Array<string>();
    this.fileNames = new Array<string>();
    document.forms['newPubliForm'].reset();
    this.modalNewPubli.hide();
  }

  likePubli(publiId: number) {
    console.log('publiId: ', publiId);
    let publiLiked = this.publicaciones.find(publi => publi.id === publiId);
    publiLiked.likes.push(this.profesor.id);
    console.log('publi liked: ', publiLiked);
    let like = {"likes": publiLiked.likes};
    this.publiService.likePubli(publiId, like).subscribe((data) => {
      console.log('response like: ', data);
      if (data != undefined) {
        this.publicaciones.forEach(publi => {
          if (publi.id == publiId) {
            publi = publiLiked;
            publi.isLike = true;
            console.log('publi updated ', publi);
          }
        });
        console.log('publis new: ',this.publicaciones)
      }
    });
  }

  dislikePubli(publiId: number) {
    console.log('publiId: ', publiId)
    let publi = this.publicaciones.find(publi => publi.id === publiId);
    console.log('find: ', publi);
    publi.likes.splice(publi.likes.indexOf(this.profesor.id), 1);
    console.log('publi disliked: ', publi);
    let dislike = {"likes": publi.likes};
    this.publiService.dislikePubli(publiId, dislike).subscribe((data) => {
      console.log('response dislike: ', data);
      this.publicaciones.forEach(p => {
        if (p.id == publiId) {
          console.log('p foreach: ', p);
          p = publi;
          p.isLike = false;
        }
      });
      console.log('new publis: ', this.publicaciones);
    });
  }

  setLikesModal(likes){
    this.likesSeeModal = new Array<Profesor>();
    likes.forEach((like) => {
      if(this.profesores.has(like)){
        this.likesSeeModal.push(this.profesores.get(like));
      } 
    })
    console.log('likes: ', this.likesSeeModal);
  }

  setFilesModal(ficheros) {
    console.log('entra ficheros: ', ficheros);
    this.filesSeeModal = ficheros;
  }

  downloadFile(fileName) {
    console.log('Fichero a descargar: ', fileName);
    this.imgService.downloadFilePublicacion(fileName).subscribe((data) => {
      try {
        const blob = new Blob([data]);
        saveAs(blob, fileName);
      }
      catch (error) {
        Swal.fire('Error', 'Error descargando fichero', 'error');
      }
    }, (error) => {
      Swal.fire('Error', 'Error obteniendo fichero', 'error');
    })
  }

  downloadAllFiles(fileNames) {
    let zip = new JSZip();
    let folder = zip.folder('ficheros');
    let count = 0;
    for (let fileName of fileNames) {
      this.imgService.downloadFilePublicacion(fileName).subscribe((data) => {
        try {
          folder.file(`${fileName}`, data);
          count++;
          if(fileNames.length == count){
            zip.generateAsync({ type: "blob" }).then(function (blob) {
              saveAs(blob, "ficheros.zip");
            }, function (err) {
              this.isDownloading = false;
              console.log(err);
              Swal.fire('Error', 'Error al descargar:( Inténtalo de nuevo más tarde', 'error')
            });
          }
        }
        catch (error) {
          Swal.fire('Error', 'Error descargando fichero ' + fileName, 'error');
        }
      }, (error) => {
        Swal.fire('Error', 'Error obteniendo fichero ' + fileName, 'error');
      })
    }
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

      const newComment = { "comentario": comentario, "fecha": today, "autorId": this.profesor.id, "publicacionId": publiId };
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
      if (data != null) {
        APIfileNames = data;
        for (let i = 0; i < files.length; i++) {
          let filter = APIfileNames.find(f => f.name === files[i].name);
          if (filter != null) {
            Swal.fire('Error', 'El fichero ' + files[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
            break;
          } else {
            console.log('Se puede subir ', files[i].name);
            if (!this.mapImgs.has(files[i].name)) {
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
      if (data != null) {
        APIfileNames = data;
        for (let i = 0; i < files.length; i++) {
          let filter = APIfileNames.find(f => f.name === files[i].name);
          if (filter != null) {
            Swal.fire('Error', 'El fichero ' + files[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
            break;
          } else {
            console.log('Se puede subir ', files[i].name);
            if (!this.mapFiles.has(files[i].name)) {
              this.mapFiles.set(files[i].name, new FormData());
              this.mapFiles.get(files[i].name).append(files[i].name, files[i]);
              this.fileNames.push(files[i].name);
            }
          }
        }
      }
    });
  }

  unselectFile(type: string, name: string) {
    switch (type) {
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
  borrarPublicacion(publi: any) {

    //BORRA IMAGENES, FICHEROS Y PUBLICACIÓN
    if (publi.imagenes != undefined && publi.ficheros != undefined) {
      if (publi.imagenes.length > 0 && publi.ficheros.length > 0) {
        publi.imagenes.forEach(imagen => {
          this.publiService.deleteImgPubli(imagen).subscribe(() => {
            publi.ficheros.forEach(fichero => {
              this.publiService.deleteFicheroPubli(fichero).subscribe(() => {
                if (publi.comentarios != undefined) {
                  this.publiService.deleteCommentsPubli(publi.id).subscribe(() => {
                    this.publiService.deletePubli(publi.id).subscribe(() => {
                      Swal.fire("Hecho", "Publicación eliminada correctamente", "success")
                      this.ngOnInit();
                    }), (error) => {
                      console.log(error);
                      Swal.fire("Error", "Error eliminando la publicación", "error");
                    }
                  })
                }
              })
            })
          })
        })
      }
      else {
        //BORRA PUBLICACIÓN CON IMÁGENES
        if (publi.imagenes.length > 0) {
          publi.imagenes.forEach(imagen => {
            this.publiService.deleteImgPubli(imagen).subscribe(() => {
              if (publi.comentarios != undefined) {
                this.publiService.deleteCommentsPubli(publi.id).subscribe(() => {
                  this.publiService.deletePubli(publi.id).subscribe(() => {
                    Swal.fire("Hecho", "Publicación eliminada correctamente", "success")
                    this.ngOnInit();
                  }), (error) => {
                    console.log(error);
                    Swal.fire("Error", "Error eliminando la publicación", "error");
                  }
                })
              }
            })
          })
        }
        //BORRA PUBLICACIÓN CON FICHEROS
        else if (publi.ficheros.length > 0) {
          console.log("entra")
          publi.ficheros.forEach(fichero => {
            this.publiService.deleteFicheroPubli(fichero).subscribe(() => {
              if (publi.comentarios != undefined) {
                this.publiService.deleteCommentsPubli(publi.id).subscribe(() => {
                  this.publiService.deleteComment(publi.id).subscribe(() => {
                    Swal.fire("Hecho", "Publicación eliminada correctamente", "success")
                    this.ngOnInit();
                  }), (error) => {
                    console.log(error);
                    Swal.fire("Error", "Error eliminando la publicación", "error");
                  }
                })
              }
            })
          })
        }
      }
    }
    //BORRA PUBLICACIÓN SIN IMÁGENES NI FICHEROS
    else {
      this.publiService.deletePubli(publi.id).subscribe(() => {
        Swal.fire("Hecho", "Publicación eliminada correctamente", "success")
        this.ngOnInit();
      }), (error) => {
        console.log(error);
        Swal.fire("Error", "Error eliminando la publicación", "error");
      }
    }

  }



  //Función para borrar comentario
  borrarComment(comment: any) {
    this.publiService.deleteComment(comment.id).subscribe(() => {
      Swal.fire("Hecho", "Comentario eliminado correctamente", "success")
      this.ngOnInit();
    }), (error) => {
      console.log(error);
      Swal.fire("Error", "Error eliminando el comentario", "error");
    }
  }
}
