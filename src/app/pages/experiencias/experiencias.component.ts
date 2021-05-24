import { Publicacion } from './../../clases/Publicacion';
import { Comentario } from './../../clases/Comentario';
import { SesionService } from './../../services/sesion.service';
import { Profesor } from './../../clases/Profesor';
import { AuthService } from './../../services/auth.service';
import { PublicacionesService } from './../../services/publicaciones.service';
import { Component, OnInit } from '@angular/core';

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
  mapPublicaciones = new Map<String,Publicacion>();

  isLogged;
  profesor;

  sndbtn;

  constructor(private auth: AuthService,private publiService: PublicacionesService, private sesion: SesionService) { }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()) {
      this.isLogged = true;
      this.profesor = this.sesion.DameProfesor();
      if(this.profesor == undefined) {
        sessionStorage.removeItem("ACCESS_TOKEN");
        this.isLogged = false;
      }
    }
    else this.isLogged = false;
    
    this.publiService.damePublicaciones().subscribe(data => {
      console.log('publicaciones: '+data);
      if(data != undefined){
        this.publicaciones = data;
        //Ordena de más reciente a más antigua
        this.publicaciones.forEach(publi => {
          console.log('likes: '+publi.likes);
          this.publiService.dameComentariosPubli(publi.id).subscribe((comments) => {
            if(comments != undefined){
              publi.comentarios = comments;
              comments.forEach(comm => {
                this.publiService.dameAutorComentario(comm.id).subscribe((autor) => {
                  if(autor != undefined){
                    comm.autor = autor;
                  }
                })
              })
            }
          })
        });
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
      }
    });   
  }

  sendComment(publiId: number){
    console.log('entra send '+publiId);   
    if((<HTMLInputElement>document.getElementById(publiId.toString())).value.length != 0){
      const comentario = (<HTMLInputElement>document.getElementById(publiId.toString())).value;
      console.log(comentario);
      (<HTMLInputElement>document.getElementById(publiId.toString())).value = '';      
      
      const today = new Date().toISOString();
      
      const newComment = {"comentario" : comentario, "fecha":today, "likes": 0, "autorId": this.profesor.id, "publicacionId": publiId};
      console.log('new comment: '+newComment);
      
      this.publiService.comentar(publiId, newComment).subscribe(data => {
        console.log(data);
        data.autor = this.profesor;
        this.publicaciones.forEach(publi => {
          if(publi.id == publiId){
            publi.comentarios.unshift(data);
          }
        })
      });
    }
  }

  sendPubli(){
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
      this.publicaciones.unshift(data);
    })
  }

  like(publiId: number){
    let prof = this.profesor;
    prof.publicacionId = publiId;
    prof.id = null;
    this.publiService.like(publiId, this.profesor).subscribe(data => {
      console.log('like response: '+data);
      this.publicaciones.forEach(publi => {
        publi.likes.unshift(data);
      });
    });
  }
}
