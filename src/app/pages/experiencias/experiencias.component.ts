import { Publicacion } from './../../clases/Publicacion';
import { Comentario } from './../../clases/Comentario';
import { SesionService } from './../../services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { AuthService } from './../../services/auth.service';
import { PublicacionesService } from './../../services/publicaciones.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-experiencias',
  templateUrl: './experiencias.component.html',
  styleUrls: ['./experiencias.component.scss']
})
export class ExperienciasComponent implements OnInit {

  isCollapsed = true;
  focus1;
  focus2;

  publicaciones;
  mapPublicaciones = new Map<String, Publicacion>();

  comments;

  isLogged;
  profesor;

  sndbtn;

  file;
  newImg;

  constructor(private auth: AuthService, private publiService: PublicacionesService, private sesion: SesionService) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.isLogged = true;
      this.profesor = this.sesion.DameProfesor();
      if (this.profesor == undefined) {
        sessionStorage.removeItem("ACCESS_TOKEN");
        this.isLogged = false;
      }
    }
    else this.isLogged = false;

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
              });
            };
          });
          //Comprueba si soy el propietario
          if (this.profesor != undefined) {
            publi.isPropietario = this.isPropietario(publi);
          }
        });


      }



    });
  }

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
  }

  sendPubli() {
    const titulo = (<HTMLInputElement>document.getElementById("TituloPublicacion")).value;
    (<HTMLInputElement>document.getElementById("TituloPublicacion")).value = '';

    const experiencia = (<HTMLInputElement>document.getElementById("Experiencia")).value;
    (<HTMLInputElement>document.getElementById("Experiencia")).value = '';

    const today = new Date().toISOString();
    console.log(today);

    let publi = new Publicacion(titulo, experiencia, today, this.profesor.id, [], []);
    console.log('publi: ', publi)

    this.publiService.publicar(publi).subscribe((data) => {
      console.log(data);
      data.autor = this.profesor;
      data.fecha = moment(data.fecha).lang('es').fromNow();
      data.likes = [];
      this.publicaciones.unshift(data);
    })
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

  mostrarImagenUpload($event) {
    this.file = $event.target.files[0];

    console.log('fichero: ', this.file.name);
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      console.log('carga imagen');
      this.newImg = reader.result.toString();
    }
  }

  activarInput() {
    document.getElementById("inp").click();
  }

  //Función para ver si soy el propietario del recurso
  isPropietario(publi) {
    console.log("this.prof: ", this.profesor.id);
    console.log("recurso.prof: ", publi.autorId);
    if (this.profesor.id == publi.autorId) {

      return true
    }
    else {

      return false
    }

  }

  borrarPublicacion(publi: any){
    this.publiService.deletePubli(publi.id).subscribe(() => {
      Swal.fire("Hecho", "Publicación eliminada correctamente", "success")
    }), (error) => {
      console.log(error);
      Swal.fire("Error", "Error eliminando la publicación", "error");
    }
  }
}
