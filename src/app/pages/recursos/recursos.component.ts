import { Cromo } from './../../clases/recursos/Cromo';
import { FamiliaDeImagenesDePerfil } from './../../clases/recursos/FamiliaDeImagenesDePerfil';
import { Coleccion } from './../../clases/recursos/Coleccion';
import { ImagenesService } from './../../services/imagenes.service';
import { Profesor } from 'src/app/clases/Profesor';
import { RecursosService } from './../../services/recursos.service';
import { Pregunta } from 'src/app/clases/recursos/Pregunta';
import { Router } from '@angular/router';
import { FamiliaAvatares } from './../../clases/recursos/FamiliaAvatares';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService } from 'src/app/services/sesion.service';
import Swal from 'sweetalert2';
import { ModalContainerComponent } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {
  
  isCollapsed = true;
  isLogged: boolean;
  profesor: Profesor;

  //Variables para subir recursos por formulario
  form;
  typeRscUpload: string;
  finishForm = false;

  //Variable para subir recursos por JSON
  uploadByJson: boolean = null;
  rscJson = null;
  rscJsonName = null;
  mapImgsJson = new Map<string, FormData>();
  imgsJsonNames = new Array<string>();
  ejemploJSON: string;
  imgColJson: FormData;
  imgColJsonName: string = null;

  //Variables wrappers para subir recursos (clases al final del documento)
  preguntaWrapper: PreguntaWrapper;
  avatarWrapper: AvatarWrapper;
  imgPerfilWrapper: ImagenesPerfilWrapper;
  coleccionWrapper: ColeccionWrapper;

  //Variables subir pregunta
  respuestasForm: boolean = false;
  typeQuestion: string;
  contOptions: number = 0;
  imgPregunta: FormData;
  parejasMap: Map<number, any> = new Map<number, any>();
  newPregunta: Pregunta;

  //Variables subir avatares
  imgAvataresForm: boolean = false;
  imgSilueta: FormData;
  imagenesComp1: FormData;
  imagenesComp2: FormData;
  imagenesComp3: FormData;
  imagenesComp4: FormData;
  newFamiliaAvatares: FamiliaAvatares;

  //Variables subir coleccion
  cromosForm: boolean = false;
  imagenesColeccion = new Map<string, FormData>();
  cromosMap: Map<number, CromoWrapper> = new Map<number, CromoWrapper>();
  newColeccion: Coleccion;

  //Variables subir imagenes perfil
  imagenesPerfil: FormData;
  newFamiliaImgsPerfil: FamiliaDeImagenesDePerfil;


  constructor(
    private auth: AuthService, 
    private router: Router, 
    private sesion: SesionService, 
    private rscService: RecursosService,
    private imgService: ImagenesService) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.isLogged = true;
      this.sesion.EnviameProfesor().subscribe ( profesor => this.profesor = profesor);
    }
    else this.isLogged = false;

    this.form = document.forms['rscForm'];

    for (let i = 1; i < 5; i++) {
      this.parejasMap.set(i, new Object);
    }

    for (let i = 1; i < 7; i++) {
      this.cromosMap.set(i, new CromoWrapper());
    }
    

    this.preguntaWrapper = new PreguntaWrapper();
    this.avatarWrapper = new AvatarWrapper();
    this.coleccionWrapper = new ColeccionWrapper();
    this.imgPerfilWrapper = new ImagenesPerfilWrapper();

    console.log(JSON.stringify(this.preguntaWrapper));
    console.log(JSON.stringify(this.avatarWrapper));
    console.log(JSON.stringify(this.coleccionWrapper));
    console.log(JSON.stringify(this.imgPerfilWrapper));

  }

  //Obtenemos el componente modal para poder cerrarlo desde aquí
  @ViewChild('modalUploadRsc', { static: true }) modalUploadRsc: ModalContainerComponent;

  //Función para cerrar modal y devolverlo al estado inicial
  resetForm(){
    this.typeRscUpload = undefined;
    this.respuestasForm = false;
    this.imgAvataresForm = false;
    this.cromosForm = false;
    this.finishForm = false;
    
    //Variables subir JSON
    this.uploadByJson = null;
    this.rscJson = null;
    this.rscJsonName = null;
    this.mapImgsJson = new Map<string, FormData>();
    this.imgsJsonNames = new Array<string>();
    this.imgColJsonName = null;
    this.imgColJson = null;

    this.typeQuestion = undefined;

    this.contOptions = 0;

    this.avatarWrapper = new AvatarWrapper();
    this.preguntaWrapper = new PreguntaWrapper();
    this.coleccionWrapper = new ColeccionWrapper();
    this.imgPerfilWrapper = new ImagenesPerfilWrapper();

    this.imagenesColeccion = new Map<string,FormData>();

    for (let i = 1; i < 5; i++) {
      this.parejasMap.set(i, new Object);
    }

    for (let i = 1; i < 7; i++) {
      this.cromosMap.set(i, new CromoWrapper());
    }

    this.form.reset();
    this.modalUploadRsc.hide();
  }

  //Función auxiliar para customizar las inputs de las imagenes
  activarInputImagen(inputId: string) {
    document.getElementById(inputId).click();
  }   

  /******************************************** */
  /************** FORMULARIOS ***************** */
  /******************************************** */

  //Recoge el tipo de recurso a subir
  updateTypeRsc() {
    if(this.uploadByJson != null){
      if (this.form['typeRsc'].value != 'Seleccione un tipo de recurso...') {
        this.typeRscUpload = this.form['typeRsc'].value;
        console.log('typeRsc: ', this.typeRscUpload);
        if(this.typeRscUpload == 'Imágenes de perfil'){
          this.finishForm = true;
        }
        
        if (document.getElementById('typeRsc').style.borderColor == "red")
          document.getElementById('typeRsc').style.borderColor = "#525f7f";
      } else {
        document.getElementById('typeRsc').style.borderColor = "red";
      }
    } else {
      Swal.fire('Error', 'Selecciona método de subida', 'error');
    }
  }

  /////////////// SUBIR RSC CON JSON ////////////////
  checkUploadJSON(value){
    this.uploadByJson = value;
  }

  activarInputJSON(){
    document.getElementById("json").click();
  }

  showInfoJson(){
    let mensaje2;
    let mensaje = 'Para subir un recurso de tipo '+this.typeRscUpload+' a través de un archivo JSON, debes asegurarte de que el fichero cumple con los requisitos del modelo.\n\n ';
    mensaje += 'EJEMPLO MODELO '+this.typeRscUpload +'\n\n';
    switch(this.typeRscUpload){
      case 'Pregunta':{
        mensaje += '{\n\"titulo\":\"text\",\n\"tipo\":\"text\",\n\"pregunta\":\"text\",\n'
        +'\"tematica\":\"text\",\n\"imagen\":\"nombre-imagen.png\",\n\"feedbackCorrecto\":\"text\",\n'
        +'\"feedbackIncorrecto\":\"text\",\n\"respuestaCorrecta\":\"text\",\n\"respuestaIncorrecta1\":\"text\",\n'
        +'\"respuestaIncorrecta2\":\"text\",\n\"respuestaIncorrecta3\":\"text\",\n\"emparejamientos\":\n[\n'
        +'{\"l\": \"Valor 1\", \"r\": \"Valor 2\"},\n'
        +']\n}\n\n';
        
        mensaje2 = 'Según el tipo, se rellenan unos datos especificos. Los datos que no necesites, no los pongas o asígnales valor null (sin comillas). '
        + 'Los casos según el tipo de pregunta son los siguientes (en cualquier caso, la imagen en las preguntas es opcional):\n\n'
        + '- Cuatro opciones: todos los campos menos emparejamientos.\n\n'
        + '- Verdadero o falso: campos respuestaIncorrectaX y emparejamientos no necesarios, "respuestaCorrecta":true/false.\n\n'
        + '- Respuesta abierta: campos respuestaIncorrectaX y emparejamientos no necesarios.\n\n'
        + '- Emparejamiento: campos respuesta no necesarios, poner tantos elementos en emparejamientos como parejas deseadas.\n\n'
        + 'Asegúrate de que el tipo del JSON coincide con los tipos especificados. Asegúrate también de que el nombre de la imagen coincide con el del JSON.'
        break;
      }
      case 'Colección': {
        mensaje += '{\n\"nombre\":\"text\",\n\"imagenColeccion\":\"imagen-silueta.png\",\n\"dosCaras\":true/false,\n\"recomendacion\":\"text\",\n'
        +'\"cromos\":[\n'
        +'{\n\"nombre\":\"text\",\n\"probabilidad\":\"MUY ALTA\",\n\"nivel\":\"BRONCE\",\n\"imagenDelante\":\"imagen1.png\",\n\"imagenDetras\":\"imagen2.jpg\"},\n'
        +'. . .\n'
        +']\n}\n\n';

        mensaje += 'Asegúrate de añadir al menos 6 cromos.\n\n';

        mensaje2 = 'Los campos de probabilidad y nivel deben llenarse con estos valores (en mayúsculas):\n'
        + '- Probabilidad: MUY ALTA, ALTA, BAJA, MUY BAJA\n'
        + '- Nivel: BRONCE, PLATA, ORO, DIAMANTE\n\n'

        mensaje2 += 'En caso de poner en el JSON dosCaras=false, la imagenDetras del cromo no es necesaria.\n'
        + 'Asegúrate de seleccionar las imágenes cuyos nombres se han introducido en los campos de imágenes.\n'
        + 'El campo recomendacion es opcional, por si quieres compartir algún consejo para el recurso.\n';
        break;
      }
      case 'Avatar': {
        mensaje += '{\n\"nombreFamilia\":\"text\",\n\"recomendacion\":\"text\",\n\"silueta\":\"imagen-silueta.png\",\n\"nombreComplemento1\":\"text\",\n'
        +'\"nombreComplemento2\":\"text\",\n\"nombreComplemento3\":\"text\",\n\"nombreComplemento4\":\"text\",\n'
        +'\"complemento1\": [ \"imagen1.jpg\", \"imagen2.jpg\", .... ],\n\"complemento2\": [ \"imagen3.jpg\", \"imagen4.jpg\", .... ],\n'
        +'\"complemento3\": [ \"imagen5.jpg\", \"imagen6.jpg\", .... ],\n\"complemento4\": [ \"imagen7.jpg\", \"imagen8.jpg\", .... ]\n}\n\n';

        mensaje += 'Asegúrate de seleccionar las imágenes cuyos nombres se han introducido en los campos de imágenes.\n'
        +'El campo recomendacion es opcional, por si quieres compartir algún consejo para el recurso.\n';
        break;
      }
      case 'Imágenes de perfil': {
        mensaje += '{\n\"nombreFamilia\":\"text\",\n\"numeroImagenes\":0,\n'
        +'\"imagenes\": [ \"imagen1.jpg\", \"imagen2.jpg\", .... ]\n}\n\n';

        mensaje += 'Asegúrate de seleccionar las imágenes cuyo nombre se ha introducido en la cadena de imágenes.\n';
        break;
      }
    }
    alert(mensaje);
    if(mensaje2 != null) alert(mensaje2);
  }

  getRscJSON($event){
    let file = $event.target.files[0];
    console.log(file);
    if(file.type == 'application/json'){
      this.rscJsonName = file.name;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        try {
          console.log('carga JSON');
          this.rscJson = JSON.parse(reader.result.toString());
          console.log(this.rscJson);
        }
        catch(error) {
          console.log(error);
          this.rscJsonName = null;
          this.rscJson = null;
          Swal.fire('Error','Formato fichero incorrecto, revisa el formato', 'error');
        }
      }
    } else {
      Swal.fire('Error','El fichero debe ser de tipo \"*.json\"', 'error');
    }
  }

  async getImagenesJSON($event){
    console.log($event.target.files);
    let images = $event.target.files;
    let APIfileNames;
    let containerName = null;

    switch(this.typeRscUpload){
      case 'Pregunta':{
        if(images.length > 1){
          Swal.fire('Error','Solo puedes subir 1 imagen para este recurso', 'error');
          break;
        } else {
          containerName = 'ImagenesPreguntas';
          break;
        }
      }
      case 'Colección': {
        let cromoContainer = 'ImagenCromo';
        let colContainer = 'ImagenColeccion';
        let APIFilesCromos;

        await this.imgService.getFileNamesContainer(colContainer).subscribe((data: Array<any>) => {
          console.log('API files: ', data);
          if(data != null){
            APIfileNames = data;
            this.imgService.getFileNamesContainer(cromoContainer).subscribe((data: Array<any>) => {
              if(data != null){
                APIFilesCromos = data;
                for(let i=0; i < images.length; i++){
                  let filter = APIfileNames.find(f => f.name === images[i].name);
                  let filter2 = APIFilesCromos.find(f => f.name === images[i].name);
                  if(filter != null || filter2 != null){
                    Swal.fire('Error', 'La imagen '+images[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
                    break;
                  } else {
                    console.log('Se puede subir ', images[i].name);
                    this.mapImgsJson.set(images[i].name, new FormData());
                    this.mapImgsJson.get(images[i].name).append(images[i].name, images[i]);
                    this.imgsJsonNames.push(images[i].name);
                  }
                }
                console.log('Imágenes: ', this.imgsJsonNames);
              }
            }, (error) => {
              Swal.fire('Error', 'No se pueden subir imágenes ahora','error');
            })
          }
        });
        break;
      }
      case 'Avatar': {
        containerName = 'ImagenesAvatares';
        break;
      }
      case 'Imágenes de perfil': {
        containerName = 'ImagenesPerfil';
        break;
      }
    }
  
    if(containerName != null){
      await this.imgService.getFileNamesContainer(containerName).subscribe((data: Array<any>) => {
        console.log('API files: ', data);
        if(data != null){
          APIfileNames = data;
          for(let i=0; i < images.length; i++){
            let filter = APIfileNames.find(f => f.name === images[i].name);
            if(filter != null){
              Swal.fire('Error', 'La imagen '+images[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
              break;
            } else {
              console.log('Se puede subir ', images[i].name);
              this.mapImgsJson.set(images[i].name, new FormData());
              this.mapImgsJson.get(images[i].name).append(images[i].name, images[i]);
              this.imgsJsonNames.push(images[i].name);
            }
          }
          console.log('Imágenes: ', this.imgsJsonNames);
        }
      });
    }
  }

  activarInputImgsJson(id: string){
    document.getElementById(id).click();
  }

  unselectImgJson(imgName){
    this.imgsJsonNames.splice(this.imgsJsonNames.indexOf(imgName), 1);
    this.mapImgsJson.delete(imgName);
  }

  async getImgColeccionJSON($event){
    console.log($event.target.files[0]);
    let img = $event.target.files[0];
    let APIfileNames;
    await this.imgService.getFileNamesContainer('ImagenColeccion').subscribe((data: Array<any>) => {
      console.log('API files: ', data);
      if(data != null){
        APIfileNames = data;
        let filter = APIfileNames.find(f => f.name === img.name);
        if(filter != null){
          Swal.fire('Error', 'La imagen '+img.name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
          this.imgColJson = null;
          this.imgColJsonName = null;
        } else {
          console.log('Se puede subir ', img.name);
          this.imgColJson = new FormData();
          this.imgColJson.append(img.name, img);
          this.imgColJsonName = img.name;
        }
      }
    });
  }

  unselectImgColJson(){
    this.imgColJson = null;
    this.imgColJsonName = null;
  }

  uploadRscByJson(){
    if(this.rscJson == null){
      Swal.fire('Error', 'Selecciona un archivo JSON', 'error');
    }

    switch(this.typeRscUpload){
      case 'Pregunta':{
        console.log(this.rscJson);
        if(this.rscService.verifyDataJson(this.typeRscUpload, this.rscJson, this.imgsJsonNames, null)){
          let pregunta = new Pregunta(
            this.rscJson.titulo,
            this.rscJson.tipo,
            this.rscJson.pregunta,
            this.rscJson.tematica,
            this.rscJson.feedbackCorrecto,
            this.rscJson.feedbackIncorrecto,
            this.profesor.id,
            this.rscJson.imagen,
            this.rscJson.emparejamientos,
            this.rscJson.respuestaCorrecta,
            this.rscJson.respuestaIncorrecta1,
            this.rscJson.respuestaIncorrecta2,
            this.rscJson.respuestaIncorrecta3
          );
          console.log('new pregunta: ', pregunta);
          this.rscService.uploadPregunta(pregunta).subscribe((data) => {
            console.log('respuesta upload pregunta: ', data);
            if(data != null){
              if(this.rscJson.imagen != null){
                this.imgService.uploadImgPregunta(this.mapImgsJson.get(this.rscJson.imagen)).subscribe((data) => {
                  console.log('respuesta upload img: ', data);
                  if(data != null){
                    Swal.fire('Hecho!', 'Pregunta subida con éxito', 'success').then(() => {
                      this.resetForm();
                    })
                  }
                }, (error) => {
                  console.log(error);
                  Swal.fire('Error', 'Error al subir imagen', 'error');
                });
              } else {
                Swal.fire('Hecho!', 'Pregunta subida con éxito', 'success').then(() => {
                  this.resetForm();
                })
              }
            }
          }, (error) => {
            console.log(error);
            Swal.fire('Error','Error al subir pregunta', 'error');
          })
        }
        break;
      }
      case 'Colección': {
        console.log(this.rscJson);
        console.log('returnsss: ', this.rscService.verifyDataJson(this.typeRscUpload, this.rscJson, this.imgsJsonNames, this.imgColJsonName));
        if(this.rscService.verifyDataJson(this.typeRscUpload, this.rscJson, this.imgsJsonNames, this.imgColJsonName)){
          let recomendation = null;
          if(this.rscJson.recomendacion != null){
            recomendation = this.rscJson.recomendacion;
          }
          let coleccion = new Coleccion(
            this.rscJson.nombre,
            this.profesor.id,
            this.rscJson.imagenColeccion,
            this.rscJson.dosCaras,
            recomendation
          );
          let cromos = this.rscJson.cromos;
          console.log('new coleccion: ', coleccion);
          this.rscService.uploadColeccion(coleccion).subscribe((data: any) => {
            console.log('respuesta upload coleccion: ', data);
            if(data != null){
              let count = 0;
              cromos.forEach(cromo => {
                let c = new Cromo(
                  cromo.nombre,
                  data.id,
                  cromo.probabilidad,
                  cromo.nivel,
                  cromo.imagenDelante,
                  cromo.imagenDetras
                );
                this.rscService.uploadCromos(c).subscribe(() => {
                  count++;
                  if(count == cromos.length){
                    this.imgService.uploadImgColeccion(this.imgColJson).subscribe((data) => {
                      for(let img of this.mapImgsJson.values()){
                        this.imgService.uploadImgCromo(img).subscribe((data) => {
                          console.log('respuesta upload img: ', data);
                          if(data != null){
                            Swal.fire('Hecho!', 'Colección subida con éxito', 'success').then(() => {
                              this.resetForm();
                            });
                          }
                        }, (error) => {
                          console.log(error);
                          Swal.fire('Error', 'Error al subir imagenes cromos', 'error');
                        });
                      }
                    }, (error) => {
                      Swal.fire('Error', 'Error al subir imagen de colección', 'error');
                    });
                  }
                });
              });
            }
          }, (error) => {
            console.log(error);
            Swal.fire('Error','Error al subir colección', 'error');
          })
        }
        break;
      }
      case 'Avatar': {
        console.log(this.rscJson);
        if(this.rscService.verifyDataJson(this.typeRscUpload, this.rscJson, this.imgsJsonNames, null)){
          let recomendation = null;
          if(this.rscJson.recomendacion != null){
            recomendation = this.rscJson.recomendacion;
          }
          let avatar = new FamiliaAvatares(
            this.rscJson.nombreFamilia,
            this.profesor.id,
            this.rscJson.silueta,
            this.rscJson.nombreComplemento1,
            this.rscJson.complemento1,
            this.rscJson.nombreComplemento2,
            this.rscJson.complemento2,
            this.rscJson.nombreComplemento3,
            this.rscJson.complemento3,
            this.rscJson.nombreComplemento4,
            this.rscJson.complemento4,
            recomendation
          )
          console.log('new avatar: ', avatar);
          this.rscService.uploadFamiliaAvatar(avatar).subscribe((data) => {
            console.log('respuesta upload avatar: ', data);
            if(data != null){
              let cont = 0;
              for(let img of this.mapImgsJson.values()){
                this.imgService.uploadImgAvatares(img).subscribe((data) => {
                  console.log('respuesta upload img: ', data);
                  cont++;
                  if(cont == this.mapImgsJson.size){
                    Swal.fire('Hecho!', 'Familia avatares subida con éxito', 'success').then(() => {
                      this.resetForm();
                    })
                  }
                }, (error) => {
                  console.log(error);
                  Swal.fire('Error', 'Error al subir família avatares', 'error');
                });
              }              
            }
          }, (error) => {
            console.log(error);
            Swal.fire('Error','Error al subir família avatares', 'error');
          })
        }
        break;
      }
      case 'Imágenes de perfil': {
        console.log(this.rscJson);
        if(this.rscService.verifyDataJson(this.typeRscUpload, this.rscJson, this.imgsJsonNames, null)){
          let imagenesPerfil = new FamiliaDeImagenesDePerfil(
            this.rscJson.nombreFamilia,
            this.rscJson.numeroImagenes,
            this.rscJson.imagenes,
            this.profesor.id
          );
          console.log('new imgsPerfil: ', imagenesPerfil);
          this.rscService.uploadFamiliaImgPerfil(imagenesPerfil).subscribe((data) => {
            console.log('respuesta upload imgPerfil: ', data);
            if(data != null){
              let cont = 0;
              for(let img of this.mapImgsJson.values()){
                this.imgService.uploadImgFamiliaImagenes(img).subscribe((data) => {
                  console.log('respuesta upload img: ', data);
                  cont++;
                  if(cont == this.mapImgsJson.size){
                    Swal.fire('Hecho!', 'Familia imágenes de perfil subida con éxito', 'success').then(() => {
                      this.resetForm();
                    })
                  }
                }, (error) => {
                  console.log(error);
                  Swal.fire('Error', 'Error al subir família imágenes de perfil', 'error');
                });
              }              
            }
          }, (error) => {
            console.log(error);
            Swal.fire('Error','Error al subir família imágenes de perfil', 'error');
          })
        }
        break;
      }
    }
  }

  ////////////////FORM IMAGENES PERFIL////////////////
  async getImagenesPerfil($event){
    this.imagenesPerfil = new FormData();
    console.log($event.target.files);
    let images = $event.target.files;
    let APIfileNames;
  
    await this.imgService.getFileNamesContainer('ImagenesPerfil').subscribe((data: Array<any>) => {
      console.log('API files: ', data);
      if(data != null){
        APIfileNames = data;
        for(let i=0; i < images.length; i++){
          let filter = APIfileNames.find(f => f.name === images[i].name);
          if(filter != null){
            Swal.fire('Error', 'La imagen '+images[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
            this.imgPerfilWrapper.imagenes = new Array();
            break;
          } else {
            console.log('Se puede subir ', images[i].name);
            this.imagenesPerfil.append(images[i].name, images[i]);
            this.imgPerfilWrapper.imagenes.push(images[i].name);
            console.log('Imagenes perfil: ', this.imgPerfilWrapper.imagenes);
          }
        }
      }
    });
  }

  unselectImgPerfil(imgName: string){
    let names = this.imgPerfilWrapper.imagenes;
    names.splice(names.indexOf(imgName), 1);
    this.imagenesPerfil.delete(imgName);
  }

  ////////////////FORM PREGUNTA///////////////////
  updateTypeQuestion() {

    if (this.form['tituloPregunta'].value != "") {
      if (document.getElementById('tituloPregunta').style.borderColor == "red")
        document.getElementById('tituloPregunta').style.borderColor = "#525f7f";
      this.preguntaWrapper.titulo = this.form['tituloPregunta'].value;

      if (this.form['tipoPregunta'].value != 'Seleccione un tipo...') {
        this.typeQuestion = this.form['tipoPregunta'].value;
        console.log('typequestion: ', this.typeQuestion);
        this.preguntaWrapper.tipo = this.form['tipoPregunta'].value;
        console.log('wrapper: ', this.preguntaWrapper);
        if (this.typeQuestion == 'Respuesta abierta' || this.typeQuestion == 'Verdadero o falso') {
          this.finishForm = true;
          this.respuestasForm = false;
        }
        if (document.getElementById('tipoPregunta').style.borderColor == "red")
          document.getElementById('tipoPregunta').style.borderColor = "#525f7f";
      } else {
        document.getElementById('tipoPregunta').style.borderColor = "red";
      }

    } else if (this.form['tipoPregunta'].value != "Seleccione un tipo...") {
      document.getElementById('tipoPregunta').style.borderColor = "#525f7f";
    } else {
      document.getElementById('tituloPregunta').style.borderColor = "red";
      document.getElementById('tipoPregunta').style.borderColor = "red";
    }
  }

  addRowParejaForm() {
    let form = document.forms['parejasForm'];
    this.parejasMap.set(this.parejasMap.size + 1, new Array<string>());
    let length = form.length;
    length = length + 1;
  }

  deleteRowParejaForm() {
    this.parejasMap.delete(this.parejasMap.size);
    let length = document.forms['parejasForm'].length;
    length = length - 1;
  }

  getParejasValues() {
    let auxMap = new Map<number, any>();
    let form = document.forms['parejasForm'];
    for (let i = 1; i < this.parejasMap.size + 1; i++) {
      if (form['parA' + i].value == "" || form['parB' + i].value == "") {
        return null;
      } else {
        auxMap.set(i, { "l": form['parA' + i].value, "r": form['parB' + i].value });
      }
    }
    console.log(auxMap);
    return auxMap;
  }

  getCommonFieldPreguntas() {

    console.log('entra comm fields 4opt');

    let questionForm = document.forms['preguntaForm'];
    let cont = 0;

    if (questionForm['tematica'].value != '') {
      if (document.getElementById('tematica').style.borderColor == "red")
        document.getElementById('tematica').style.borderColor = "#525f7f";
      this.preguntaWrapper.tematica = questionForm['tematica'].value;
      cont++;
    } else {
      document.getElementById('tematica').style.borderColor = "red";
    }

    if (questionForm['pregunta'].value != '') {
      if (document.getElementById('pregunta').style.borderColor == "red")
        document.getElementById('pregunta').style.borderColor = "#525f7f";
      this.preguntaWrapper.pregunta = questionForm['pregunta'].value;
      cont++;
    } else {
      document.getElementById('pregunta').style.borderColor = "red";
    }

    if (questionForm['feedback1'].value != '') {
      if (document.getElementById('feedback1').style.borderColor == "red")
        document.getElementById('feedback1').style.borderColor = "#525f7f";
      this.preguntaWrapper.feedbackCorrecto = questionForm['feedback1'].value;
      cont++;
    } else {
      document.getElementById('feedback1').style.borderColor = "red";
    }

    if (questionForm['feedback2'].value != '') {
      if (document.getElementById('feedback2').style.borderColor == "red")
        document.getElementById('feedback2').style.borderColor = "#525f7f";
      this.preguntaWrapper.feedbackIncorrecto = questionForm['feedback2'].value;
      cont++;
    } else {
      document.getElementById('feedback2').style.borderColor = "red";
    }

    console.log(this.preguntaWrapper);


    if (cont == 4) {
      this.respuestasForm = true;
      this.finishForm = true;
    }

    if (this.typeQuestion == 'Cuatro opciones') {
      this.contOptions = cont;
    } else {
      return cont;
    }
  }

  async getImagenPregunta($event) {

    let img = $event.target.files[0];
    
    this.imgService.checkImgNameDuplicated('ImagenesPreguntas', img.name).subscribe((data: any) => {
      console.log('API file');
      Swal.fire('Error', 'La imagen '+img.name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
      this.preguntaWrapper.imagen = null;
    }, (notFound) => {
      console.log('Se puede subir '+img.name);
      this.imgPregunta = new FormData();
      this.imgPregunta.append(img.name, img);
      this.preguntaWrapper.imagen = img.name;
    });
  }

  /////////////////FORM AVATARES//////////////////////
  updateAvatar(){
    let cont = 0;

    if (this.form['nombreAvatar'].value != '') {
      if (document.getElementById('nombreAvatar').style.borderColor == "red")
        document.getElementById('nombreAvatar').style.borderColor = "#525f7f";
      this.avatarWrapper.nombreFamilia = this.form['nombreAvatar'].value;
      cont++;
    } else {
      document.getElementById('nombreAvatar').style.borderColor = "red";
    }

    if (this.form['nombreCompAv1'].value != '') {
      if (document.getElementById('nombreCompAv1').style.borderColor == "red")
        document.getElementById('nombreCompAv1').style.borderColor = "#525f7f";
      this.avatarWrapper.nombreComplemento1 = this.form['nombreCompAv1'].value;
      cont++;
    } else {
      document.getElementById('nombreCompAv1').style.borderColor = "red";
    }

    if (this.form['nombreCompAv2'].value != '') {
      if (document.getElementById('nombreCompAv2').style.borderColor == "red")
        document.getElementById('nombreCompAv2').style.borderColor = "#525f7f";
      this.avatarWrapper.nombreComplemento2 = this.form['nombreCompAv2'].value;
      cont++;
    } else {
      document.getElementById('nombreCompAv2').style.borderColor = "red";
    }

    if (this.form['nombreCompAv3'].value != '') {
      if (document.getElementById('nombreCompAv3').style.borderColor == "red")
        document.getElementById('nombreCompAv3').style.borderColor = "#525f7f";
      this.avatarWrapper.nombreComplemento3 = this.form['nombreCompAv3'].value;
      cont++;
    } else {
      document.getElementById('nombreCompAv3').style.borderColor = "red";
    }

    if (this.form['nombreCompAv4'].value != '') {
      if (document.getElementById('nombreCompAv4').style.borderColor == "red")
        document.getElementById('nombreCompAv4').style.borderColor = "#525f7f";
      this.avatarWrapper.nombreComplemento4 = this.form['nombreCompAv4'].value;
      cont++;
    } else {
      document.getElementById('nombreCompAv4').style.borderColor = "red";
    }

    if (this.form['recomendacion'].value != ''){
      this.avatarWrapper.recomendacion = this.form['recomendacion'].value;
    }

    console.log(this.avatarWrapper);

    if(cont == 5){
      this.imgAvataresForm = true;
      this.finishForm = true;
    }
    
  }

  async getImagenSilueta($event){
    
    console.log($event.target.files[0]);
    let img = $event.target.files[0];
    
    this.imgService.checkImgNameDuplicated('ImagenesAvatares',img.name).subscribe((data) => {
      console.log('API file: ', data);
      this.imgSilueta = null;
      Swal.fire('Error', 'La imagen '+img.name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
    }, (notFound) => {
      console.log('Se puede subir ', img.name);
      this.imgSilueta = new FormData();
      this.imgSilueta.append(img.name, img);
      this.avatarWrapper.silueta = img.name;
    });
    
    console.log(this.avatarWrapper.silueta);
  }

  async getImagenesComp1($event){
    this.imagenesComp1 = new FormData();
    console.log($event.target.files);
    let images = $event.target.files;
    let APIfileNames;
  
    await this.imgService.getFileNamesContainer('ImagenesAvatares').subscribe((data: Array<any>) => {
      console.log('API files: ', data);
      if(data != null){
        APIfileNames = data;
        for(let i=0; i < images.length; i++){
          let filter = APIfileNames.find(f => f.name === images[i].name);
          if(filter != null){
            Swal.fire('Error', 'La imagen '+images[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
            this.avatarWrapper.complemento1 = new Array();
            break;
          } else {
            console.log('Se puede subir ', images[i].name);
            this.imagenesComp1.append(images[i].name, images[i]);
            this.avatarWrapper.complemento1.push(images[i].name);
          }
        }
      }
    });
  
    console.log('Complemento 1: ', this.avatarWrapper.complemento1);
  }

  async getImagenesComp2($event){
    this.imagenesComp2 = new FormData();
    console.log($event.target.files);
    let images = $event.target.files;
    let APIfileNames;
  
    await this.imgService.getFileNamesContainer('ImagenesAvatares').subscribe((data: Array<any>) => {
      console.log('API files: ', data);
      if(data != null){
        APIfileNames = data;
        for(let i=0; i < images.length; i++){
          let filter = APIfileNames.find(f => f.name === images[i].name);
          if(filter != null){
            Swal.fire('Error', 'La imagen '+images[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
            this.avatarWrapper.complemento2 = new Array();
            break;
          } else {
            console.log('Se puede subir ', images[i].name);
            this.imagenesComp2.append(images[i].name, images[i]);
            this.avatarWrapper.complemento2.push(images[i].name);
          }
        }
      }
    });
  
    console.log('Complemento 2: ', this.avatarWrapper.complemento2);
  }

  async getImagenesComp3($event){
    this.imagenesComp3 = new FormData();
    console.log($event.target.files);
    let images = $event.target.files;
    let APIfileNames;
  
    await this.imgService.getFileNamesContainer('ImagenesAvatares').subscribe((data: Array<any>) => {
      console.log('API files: ', data);
      if(data != null){
        APIfileNames = data;
        for(let i=0; i < images.length; i++){
          let filter = APIfileNames.find(f => f.name === images[i].name);
          if(filter != null){
            Swal.fire('Error', 'La imagen '+images[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
            this.avatarWrapper.complemento3 = new Array();
            break;
          } else {
            console.log('Se puede subir ', images[i].name);
            this.imagenesComp3.append(images[i].name, images[i]);
            this.avatarWrapper.complemento3.push(images[i].name);
          }
        }
      }
    });
  
    console.log('Complemento 3: ', this.avatarWrapper.complemento3);
  }

  async getImagenesComp4($event){
    this.imagenesComp4 = new FormData();
    console.log($event.target.files);
    let images = $event.target.files;
    let APIfileNames;
  
    await this.imgService.getFileNamesContainer('ImagenesAvatares').subscribe((data: Array<any>) => {
      console.log('API files: ', data);
      if(data != null){
        APIfileNames = data;
        for(let i=0; i < images.length; i++){
          let filter = APIfileNames.find(f => f.name === images[i].name);
          if(filter != null){
            Swal.fire('Error', 'La imagen '+images[i].name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
            this.avatarWrapper.complemento4 = new Array();
            break;
          } else {
            console.log('Se puede subir ', images[i].name);
            this.imagenesComp4.append(images[i].name, images[i]);
            this.avatarWrapper.complemento4.push(images[i].name);
          }
        }
      }
    });
  
    console.log('Complemento 4: ', this.avatarWrapper.complemento4);
  }

  unselectImgAvatar(compNumber, imgName){
    let names;

    switch(compNumber){
      case 1:{
        names = this.avatarWrapper.complemento1;
        names.splice(names.indexOf(imgName), 1);
        this.imagenesComp1.delete(imgName);
        break;
      }
      case 2:{
        names = this.avatarWrapper.complemento2;
        names.splice(names.indexOf(imgName), 1);
        this.imagenesComp2.delete(imgName);
        break;
      }
      case 3:{
        names = this.avatarWrapper.complemento3;
        names.splice(names.indexOf(imgName), 1);
        this.imagenesComp3.delete(imgName);
        break;
      }
      case 4:{
        names = this.avatarWrapper.complemento4;
        names.splice(names.indexOf(imgName), 1);
        this.imagenesComp4.delete(imgName);
        break;
      }
    }
  }

  ////////////////FORM COLECCIONES///////////////////
  updateColeccion() {
    let cont = 0;
    if (this.form['nombreColeccion'].value != '') {
      if (document.getElementById('nombreColeccion').style.borderColor == "red")
        document.getElementById('nombreColeccion').style.borderColor = "#525f7f";
      this.coleccionWrapper.nombre = this.form['nombreColeccion'].value;
      cont++;
    } else {
      document.getElementById('nombreColeccion').style.borderColor = "red";
      cont--;
    }

    if(this.form['dosCaras'].value == 'Sí'){
      this.coleccionWrapper.dosCaras = true;
      cont++;
    } else {
      this.coleccionWrapper.dosCaras = false;
      cont++;
    }

    if (this.form['recomendacion'].value != ''){
      this.avatarWrapper.recomendacion = this.form['recomendacion'].value;
    }

    if(this.coleccionWrapper.imagenColeccion != null){
      cont++;
    } else {
      Swal.fire('Error','Imagen colección obligatoria','error');
    }

    if(cont == 3){
      this.cromosForm = true;
      this.finishForm = true;
      console.log(this.coleccionWrapper);
    }
  }

  getImagenColeccion($event){
    console.log($event.target.files[0]);
    let img = $event.target.files[0];
    
    this.imgService.checkImgNameDuplicated('ImagenColeccion',img.name).subscribe((data) => {
      console.log('API file: ', data);
      this.coleccionWrapper.imagenColeccion = null;
      if(this.imagenesColeccion.has(img.name)) this.imagenesColeccion.delete(img.name);
      Swal.fire('Error', 'La imagen '+img.name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
    }, (notFound) => {
      console.log('Se puede subir ', img.name);
      let imgFile = new FormData();
      imgFile.append(img.name, img);
      this.imagenesColeccion.set(img.name, imgFile);
      this.coleccionWrapper.imagenColeccion = img.name;
      console.log('coleccion wrapper: ', this.coleccionWrapper);
    });

    console.log('fotos coleccion: ', this.imagenesColeccion);
  }

  activarInputCromoDelante(inputId){
    console.log('inputIMG: '+inputId);
    document.getElementById(inputId).click();
  }

  getImgDelanteCromos($event, numCromo){
    console.log($event.target.files[0]);
    console.log('num cromo: ', numCromo);
    let img = $event.target.files[0];

    if(this.imagenesColeccion.has(img.name)){
      console.log('entra hasNameMapDelante');
      document.forms['cromosForm'][numCromo+'A'].value = null;
      Swal.fire('Error', 'Ya has seleccionado una imagen con el mismo nombre', 'error');
    } else {
      this.imgService.checkImgNameDuplicated('ImagenCromo',img.name).subscribe((data) => {
        console.log('API file: ', data);
        this.cromosMap.get(numCromo).imagenDelante = null;
        Swal.fire('Error', 'La imagen '+img.name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
      }, (notFound) => {
        console.log('Se puede subir ', img.name);
        this.cromosMap.get(numCromo).imagenDelante = img.name;
        let imgFile = new FormData();
        imgFile.append(img.name, img);
        this.imagenesColeccion.set(img.name, imgFile);
        console.log('cromo wrapper: ', this.cromosMap.get(numCromo));
      });
    }

    console.log('fotos coleccion: ', this.imagenesColeccion);

  }

  unselectImgCromoDelante(index){
    let name = this.cromosMap.get(index).imagenDelante;
    this.cromosMap.get(index).imagenDelante = null;
    this.imagenesColeccion.delete(name);
    console.log('fotos coleccion: ', this.imagenesColeccion);

  }

  activarInputCromoDetras(inputId){
    document.getElementById(inputId).click();
  }

  getImgDetrasCromos($event, numCromo){
    console.log($event.target.files[0]);
    let img = $event.target.files[0];
    
    if(this.imagenesColeccion.has(img.name)){
      console.log('entra hasNameMapDetras');
      document.forms['cromosForm'][numCromo+'B'].value = null;
      Swal.fire('Error', 'Ya has seleccionado una imagen con el mismo nombre', 'error');
    } else {
      this.imgService.checkImgNameDuplicated('ImagenCromo',img.name).subscribe((data) => {
        console.log('API file: ', data);
        this.cromosMap.get(numCromo).imagenDetras = null;
        Swal.fire('Error', 'La imagen '+img.name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
      }, (notFound) => {
        console.log('Se puede subir ', img.name);
        this.cromosMap.get(numCromo).imagenDetras = img.name
        let imgFile = new FormData();
        imgFile.append(img.name, img);
        this.imagenesColeccion.set(img.name, imgFile);
        console.log('cromo wrapper: ', this.cromosMap.get(numCromo));
      });
    }
    console.log('fotos coleccion: ', this.imagenesColeccion);

  }

  unselectImgCromoDetras(index){
    let name = this.cromosMap.get(index).imagenDetras;
    this.cromosMap.get(index).imagenDetras = null;
    this.imagenesColeccion.delete(name);
    console.log('fotos coleccion: ', this.imagenesColeccion);

  }

  /* nombre: string;
  imagenDelante: string;
  imagenDetras: string;
  probabilidad: string;
  nivel: string;
  coleccionId: number; */
  getCromos(){
    let cont = 0;
    let auxMap = new Map<number, Cromo>();
    let cromosForm = document.forms['cromosForm'];
    for (let numCromo = 1; numCromo < this.cromosMap.size + 1; numCromo++) {
      if (cromosForm['name'+numCromo.toString()].value != '') {
        if (document.getElementById('name'+numCromo.toString()).style.borderColor == "red")
          document.getElementById('name'+numCromo.toString()).style.borderColor = "#525f7f";
        let auxCromo = this.cromosMap.get(numCromo);
        console.log('name'+numCromo.toString()+': ', cromosForm['name'+numCromo.toString()].value);
        auxCromo.nombre = cromosForm['name'+numCromo.toString()].value;
        auxCromo.nivel = cromosForm['nivel'+numCromo.toString()].value;
        auxCromo.probabilidad = cromosForm['prob'+numCromo.toString()].value;
        auxMap.set(numCromo, new Cromo(
          auxCromo.nombre,
          null,
          auxCromo.probabilidad,
          auxCromo.nivel,
          auxCromo.imagenDelante,
          auxCromo.imagenDetras
        ));
        cont++;
      } else {
        document.getElementById('name'+numCromo.toString()).style.borderColor = "red";
        if(cont != 0) cont--;
      }
    }

    if(cont == this.cromosMap.size){
      console.log(auxMap);
      return auxMap;
    } else {
      return null;
    }
  }

  addRowCromoForm(){
    let form = document.forms['cromosForm'];
    this.cromosMap.set(this.cromosMap.size + 1, new CromoWrapper());
    let length = form.length;
    length = length + 1;
  }

  deleteRowCromoForm(){
    this.cromosMap.delete(this.cromosMap.size);
    let length = document.forms['cromosForm'].length;
    length = length - 1;
  }

  /************************************ */
  /********** SUBIR RECURSOS ********** */
  /************************************ */

  uploadResource() {

    this.form = document.forms['rscForm'];

    let questionForm = document.forms['preguntaForm'];
    let cromosForm = document.forms['cromosForm'];

    console.log('Tipo recurso a subir: ' + this.typeRscUpload);

    switch(this.typeRscUpload){
      case 'Pregunta':
        this.uploadPregunta(questionForm);
        break;
      case 'Avatar':
        this.uploadAvatar();
        break;
      case 'Colección':
        this.uploadColeccion(cromosForm);
        break;
      case 'Imágenes de perfil':
        this.uploadImagenesPerfil(this.form);
        break;
    }
  }

  //Lógica para subir pregunta
  uploadPregunta(questionForm){
    console.log('Tipo pregunta a subir: ', this.typeQuestion);
    if (this.typeQuestion == 'Respuesta abierta') {

      let contOpen = this.getCommonFieldPreguntas();

      if (questionForm['respAbierta'].value != '') {
        if (document.getElementById('respAbierta').style.borderColor == "red")
          document.getElementById('respAbierta').style.borderColor = "#525f7f";
        this.preguntaWrapper.respuestaCorrecta = questionForm['respAbierta'].value;
        contOpen++;
      } else {
        document.getElementById('respAbierta').style.borderColor = "red";
      }

      if (contOpen == 5) {
        this.newPregunta = new Pregunta(
          this.preguntaWrapper.titulo,
          this.preguntaWrapper.tipo,
          this.preguntaWrapper.pregunta,
          this.preguntaWrapper.tematica,
          this.preguntaWrapper.feedbackCorrecto,
          this.preguntaWrapper.feedbackIncorrecto,
          this.profesor.id,
          this.preguntaWrapper.imagen,
          null,
          this.preguntaWrapper.respuestaCorrecta
        );
      }
    } else if (this.typeQuestion == 'Cuatro opciones') {
      let contOptions = this.contOptions;

      if (questionForm['respOpciones'].value != '') {
        if (document.getElementById('respOpciones').style.borderColor == "red")
          document.getElementById('respOpciones').style.borderColor = "#525f7f";
        this.preguntaWrapper.respuestaCorrecta = questionForm['respOpciones'].value;
        contOptions++;
      } else {
        document.getElementById('respOpciones').style.borderColor = "red";
      }

      if (questionForm['respInc1'].value != '') {
        if (document.getElementById('respInc1').style.borderColor == "red")
          document.getElementById('respInc1').style.borderColor = "#525f7f";
        this.preguntaWrapper.respuestaIncorrecta1 = questionForm['respInc1'].value;
        contOptions++;
      } else {
        document.getElementById('respInc1').style.borderColor = "red";
      }

      if (questionForm['respInc2'].value != '') {
        if (document.getElementById('respInc2').style.borderColor == "red")
          document.getElementById('respInc2').style.borderColor = "#525f7f";
        this.preguntaWrapper.respuestaIncorrecta2 = questionForm['respInc2'].value;
        contOptions++;
      } else {
        document.getElementById('respInc2').style.borderColor = "red";
      }

      if (questionForm['respInc3'].value != '') {
        if (document.getElementById('respInc3').style.borderColor == "red")
          document.getElementById('respInc3').style.borderColor = "#525f7f";
        this.preguntaWrapper.respuestaIncorrecta3 = questionForm['respInc3'].value;
        contOptions++;
      } else {
        document.getElementById('respInc3').style.borderColor = "red";
      }

      console.log('wrapper final 4opt: ', this.preguntaWrapper);
      console.log('cont options: ', contOptions);
      if (contOptions == 8) {
        this.newPregunta = new Pregunta(
          this.preguntaWrapper.titulo,
          this.preguntaWrapper.tipo,
          this.preguntaWrapper.pregunta,
          this.preguntaWrapper.tematica,
          this.preguntaWrapper.feedbackCorrecto,
          this.preguntaWrapper.feedbackIncorrecto,
          this.profesor.id,
          this.preguntaWrapper.imagen,
          [],
          this.preguntaWrapper.respuestaCorrecta,
          this.preguntaWrapper.respuestaIncorrecta1,
          this.preguntaWrapper.respuestaIncorrecta2,
          this.preguntaWrapper.respuestaIncorrecta3
        );
      }

    } else if (this.typeQuestion == 'Verdadero o falso') {

      let contVoF = this.getCommonFieldPreguntas();

      if (questionForm['respVoF'].value != '') {
        if (document.getElementById('respVoF').style.borderColor == "red")
          document.getElementById('respVoF').style.borderColor = "#525f7f";
        this.preguntaWrapper.respuestaCorrecta = questionForm['respVoF'].value;
        contVoF++;
      } else {
        document.getElementById('respVoF').style.borderColor = "red";
      }

      if (contVoF == 5) {
        this.newPregunta = new Pregunta(
          this.preguntaWrapper.titulo,
          this.preguntaWrapper.tipo,
          this.preguntaWrapper.pregunta,
          this.preguntaWrapper.tematica,
          this.preguntaWrapper.feedbackCorrecto,
          this.preguntaWrapper.feedbackIncorrecto,
          this.profesor.id,
          this.preguntaWrapper.imagen,
          null,
          this.preguntaWrapper.respuestaCorrecta
        );
      }
    } else if (this.typeQuestion == 'Emparejamiento') {

      if (this.getParejasValues() != null) {
        this.newPregunta = new Pregunta(
          this.preguntaWrapper.titulo,
          this.preguntaWrapper.tipo,
          this.preguntaWrapper.pregunta,
          this.preguntaWrapper.tematica,
          this.preguntaWrapper.feedbackCorrecto,
          this.preguntaWrapper.feedbackIncorrecto,
          this.profesor.id,
          this.preguntaWrapper.imagen,
          Array.from(this.getParejasValues().values()),
        );
      } else {
        Swal.fire('Error', 'Rellena todos los campos', 'error');
      }
    }

    if (this.newPregunta != undefined) {
      console.log('upload rsc: ', this.newPregunta);
      this.rscService.uploadPregunta(this.newPregunta).subscribe((data) => {
        console.log('respuesta subir pregunta: ', data);
        if(this.newPregunta.imagen != null){
          this.imgService.uploadImgPregunta(this.imgPregunta).subscribe(() => {
            this.preguntaWrapper.imagen = null;
            Swal.fire('Hecho!', 'Pregunta subida con éxito.', 'success').then(() => {
              this.resetForm();
            })
          }, (error) => {
            console.log(error);
            Swal.fire('Error', 'Error al subir pregunta', 'error');
          });
        } else {
          Swal.fire('Hecho!', 'Pregunta subida con éxito.', 'success').then(() => {
            this.resetForm();
          })
        }
      }, (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al subir pregunta', 'error');
      });
    }
  }

  uploadAvatar(){
    let voidElems = new Array<string>();

    if(this.avatarWrapper.silueta == null){
      voidElems.push(' Silueta');
    }

    if(this.avatarWrapper.complemento1.length == 0){
      voidElems.push(' '+this.avatarWrapper.nombreComplemento1);
    }

    if(this.avatarWrapper.complemento2.length == 0){
      voidElems.push(' '+this.avatarWrapper.nombreComplemento2);
    }

    if(this.avatarWrapper.complemento3.length == 0){
      voidElems.push(' '+this.avatarWrapper.nombreComplemento3);
    }

    if(this.avatarWrapper.complemento4.length == 0){
      voidElems.push(' '+this.avatarWrapper.nombreComplemento4);
    }

    if(voidElems.length > 0){
      Swal.fire('Error','Faltan los archivos de:'+voidElems, 'error');
    } else {
      this.newFamiliaAvatares = new FamiliaAvatares(
        this.avatarWrapper.nombreFamilia,
        this.profesor.id,
        this.avatarWrapper.silueta,
        this.avatarWrapper.nombreComplemento1,
        this.avatarWrapper.complemento1,
        this.avatarWrapper.nombreComplemento2,
        this.avatarWrapper.complemento2,
        this.avatarWrapper.nombreComplemento3,
        this.avatarWrapper.complemento3,
        this.avatarWrapper.nombreComplemento4,
        this.avatarWrapper.complemento4,
        this.avatarWrapper.recomendacion
      );
      console.log(this.newFamiliaAvatares);
      this.rscService.uploadFamiliaAvatar(this.newFamiliaAvatares).subscribe(data => {
        console.log('respuesta subir avatares: ', data);
        this.imgService.uploadImgAvatares(this.imgSilueta).subscribe(() => {
          this.imgService.uploadImgAvatares(this.imagenesComp1).subscribe(() => {
            this.imgService.uploadImgAvatares(this.imagenesComp2).subscribe(() => {
              this.imgService.uploadImgAvatares(this.imagenesComp3).subscribe(() => {
                this.imgService.uploadImgAvatares(this.imagenesComp4).subscribe(() => {
                  this.avatarWrapper = new AvatarWrapper();
                  Swal.fire('Hecho!', 'Avatares subidos con éxito.', 'success').then(() => {
                    this.resetForm();
                  })
                }, (error) => {
                  console.log(error);
                  Swal.fire('Error', 'Error al subir complementos de '+this.avatarWrapper.nombreComplemento4, 'error');
                })
              }, (error) => {
                console.log(error);
                Swal.fire('Error', 'Error al subir complementos de '+this.avatarWrapper.nombreComplemento3, 'error');
              })
            }, (error) => {
              console.log(error);
              Swal.fire('Error', 'Error al subir complementos de '+this.avatarWrapper.nombreComplemento2, 'error');
            })
          }, (error) => {
            console.log(error);
            Swal.fire('Error', 'Error al subir complementos de '+this.avatarWrapper.nombreComplemento1, 'error');
          })
        }, (error) => {
          console.log(error);
          Swal.fire('Error', 'Error al subir silueta', 'error');
        });
      }, (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al subir avatares', 'error');
      });
    }
  }

  uploadImagenesPerfil(imgForm){

    let cont = 0;

    if(imgForm['nombreImgsPerfil'].value != '') {
      if (document.getElementById('nombreImgsPerfil').style.borderColor == "red")
        document.getElementById('nombreImgsPerfil').style.borderColor = "#525f7f";
      this.imgPerfilWrapper.nombreFamilia = imgForm['nombreImgsPerfil'].value;
      cont++;
    } else {
      document.getElementById('nombreImgsPerfil').style.borderColor = "red";
    }

    if(this.imgPerfilWrapper.imagenes.length == 0){
      Swal.fire('Error', 'Añade al menos 1 imagen', 'error');
    } else {
      this.newFamiliaImgsPerfil = new FamiliaDeImagenesDePerfil(
        this.imgPerfilWrapper.nombreFamilia,
        this.imgPerfilWrapper.imagenes.length,
        this.imgPerfilWrapper.imagenes,
        this.profesor.id
      );
      this.rscService.uploadFamiliaImgPerfil(this.newFamiliaImgsPerfil).subscribe((data) => {
        console.log('respuesta subir imgs perfil: '+data);
        this.imgService.uploadImgFamiliaImagenes(this.imagenesPerfil).subscribe(() => {
          this.imgPerfilWrapper = new ImagenesPerfilWrapper();
          Swal.fire('Hecho!', 'Avatares subidos con éxito.', 'success').then(() => {
            this.resetForm();
          })
        }, (error) => {
          console.log(error);
          Swal.fire('Error', 'Error al subir imágenes', 'error');
        });
      })
    }
  }

  uploadColeccion(cromosForm){
    let ready = false;

    for(let numCromo = 1; numCromo < this.cromosMap.size+1; numCromo++){
      if(this.coleccionWrapper.dosCaras){
        if(this.cromosMap.get(numCromo).imagenDelante == null || this.cromosMap.get(numCromo).imagenDetras == null){
          Swal.fire('Error','Faltan imágenes por añadir en el cromo '+numCromo, 'error');
        } else {
          if(this.getCromos() != null){
            ready = true;
          }
         
        }
      } else {
        if(this.cromosMap.get(numCromo).imagenDelante == null){
          Swal.fire('Error','Falta imagen en el cromo '+numCromo, 'error');
        } else {
          if(this.getCromos() != null){
            ready = true;
          }
        }
      }
    }

    if(ready){
      let coleccion = new Coleccion(
        this.coleccionWrapper.nombre,
        this.profesor.id,
        this.coleccionWrapper.imagenColeccion,
        this.coleccionWrapper.dosCaras
      );
      this.rscService.uploadColeccion(coleccion).subscribe((data: Coleccion) => {
        console.log('respuesta upload coleccion: ', data);
        if(data != null){
          let colId = data.id;
          let cromosData = this.getCromos();
          let contCromos = 0;
          let contImgs = 0;
          for(let cromo of cromosData.values()){
            cromo.coleccionId = colId;
            contCromos++;
            console.log('cont cromos: ', contCromos, cromosData.size);
            this.rscService.uploadCromos(cromo).subscribe(() => {
              if(contCromos == cromosData.size){
                this.imgService.uploadImgColeccion(this.imagenesColeccion.get(this.coleccionWrapper.imagenColeccion))
                  .subscribe(() => {
                    this.imagenesColeccion.delete(this.coleccionWrapper.imagenColeccion);
                    for(let img of this.imagenesColeccion.values()){
                      this.imgService.uploadImgCromo(img).subscribe((data) => {
                        console.log('respuesta upload cromos: ', data);
                        contImgs++;
                        console.log('cont imgs: ', contImgs, this.imagenesColeccion.size);
                        if(contImgs == this.imagenesColeccion.size){
                          Swal.fire('Hecho!', 'Colección subida con éxito', 'success').then(() => {
                            this.resetForm();
                          })
                        }
                      }, (error) => {
                        Swal.fire('error','Error al subir imagenes del cromo '+(contImgs+1),'error');
                      })
                    }
                  }, (error) => {
                    console.log(error);
                    Swal.fire('Error', 'Error al subir imagen colección', 'error');
                  });
              }
            }, (error) => {
              console.log(error);
              Swal.fire('Error', 'Error al subir cromos', 'error');
            })
          }
        }
      }, (error) => {
        Swal.fire('Error','Error al subir colección', 'error');
      })
    }
  }
}


//////// **CLASES WRAPPER PARA GUARDAR DATOS FORMS** /////////

class PreguntaWrapper {
  titulo: string;
  tipo: string;
  pregunta: string;
  tematica: string;
  imagen: any;
  feedbackCorrecto: string;
  feedbackIncorrecto: string;
  respuestaCorrecta: string;
  respuestaIncorrecta1: string;
  respuestaIncorrecta2: string;
  respuestaIncorrecta3: string;
  emparejamientos: [];
  profesorId: number;

  constructor(){
    this.titulo = null;
    this.tipo = null;
    this.pregunta = null;
    this.tematica = null;
    this.imagen = null;
    this.feedbackCorrecto = null;
    this.feedbackIncorrecto = null;
    this.respuestaCorrecta = null;
    this.respuestaIncorrecta1 = null;
    this.respuestaIncorrecta2 = null;
    this.respuestaIncorrecta3 = null;
    this.emparejamientos = [];
    this.profesorId = 0;
  }
}

class AvatarWrapper {
  nombreFamilia: string;
  silueta: string;
  profesorId: number;
  nombreComplemento1: string;
  complemento1: string[];
  nombreComplemento2: string;
  complemento2: string[];
  nombreComplemento3: string;
  complemento3: string[];
  nombreComplemento4: string;
  complemento4: string[];
  recomendacion: string;

  constructor() {

    this.nombreFamilia = null;
    this.silueta = null;
    this.profesorId = null;
    this.nombreComplemento1 = null;
    this.nombreComplemento2 = null;
    this.nombreComplemento3 = null;
    this.nombreComplemento4 = null;
    this.complemento1 = [];
    this.complemento2 = [];
    this.complemento3 = [];
    this.complemento4 = [];
    this.recomendacion = null;
  }
}

class ImagenesPerfilWrapper {
  nombreFamilia: string;
  numeroImagenes: number;
  imagenes: string[];
  profesorId: number;

  constructor() {
    this.nombreFamilia = null;
    this.numeroImagenes = 0;
    this.imagenes = [];
    this.profesorId = null;
  }
}

class ColeccionWrapper {
  nombre: string;
  imagenColeccion: string;
  dosCaras: boolean;
  profesorId: number;
  cromos: CromoWrapper[] = [];
  recomendacion: string;

  constructor() {

    this.nombre = null;
    this.imagenColeccion = null;
    this.dosCaras = false;
    this.profesorId = null;
    this.recomendacion = null;
  }
}

class CromoWrapper {
  nombre: string;
  imagenDelante: string;
  imagenDetras: string;
  probabilidad: string;
  nivel: string;
  coleccionId: number;

  constructor() {

    this.nombre = null;
    this.probabilidad = null;
    this.nivel = null;
    this.imagenDelante = null;
    this.imagenDetras = null;
    this.coleccionId = null;
  }
}
