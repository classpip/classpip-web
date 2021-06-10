import { Cromo } from './../../clases/recursos/Cromo';
import { forEach } from 'jszip';
import { FamiliaDeImagenesDePerfil } from './../../clases/recursos/FamiliaDeImagenesDePerfil';
import { Coleccion } from './../../clases/recursos/Coleccion';
import { ImagenesService } from './../../services/imagenes.service';
import { Profesor } from 'src/app/clases/Profesor';
import { RecursosService } from './../../services/recursos.service';
import { Pregunta } from 'src/app/clases/recursos/Pregunta';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FamiliaAvatares } from './../../clases/recursos/FamiliaAvatares';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService } from 'src/app/services/sesion.service';
import Swal from 'sweetalert2';
import { ModalContainerComponent } from 'ngx-bootstrap/modal';
import { getMatFormFieldDuplicatedHintError } from '@angular/material/form-field';


@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {
  
  isCollapsed = true;

  //Variables para subir recursos
  isLogged: boolean;
  profesor: Profesor;
  form;
  duplicatedImg: boolean = false;
  typeRscUpload: string;
  uploadByJson: boolean;
  finishForm = false;

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
  imgColeccion: FormData;
  imagenesCromos: FormData;
  cromosMap: Map<number, Cromo[]> = new Map<number, Cromo[]>();
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
      this.profesor = this.sesion.DameProfesor();
      if (this.profesor == undefined) {
        sessionStorage.removeItem("ACCESS_TOKEN");
        this.isLogged = false;
      }
    }
    else this.isLogged = false;

    this.form = document.forms['rscForm'];

    for (let i = 1; i < 5; i++) {
      this.parejasMap.set(i, new Object);
    }
    console.log('parejas map: ' + this.parejasMap);

    for (let i = 1; i < 7; i++) {
      this.cromosMap.set(i, new Array<Cromo>());
    }
    console.log('cromos map: ' + this.cromosMap);

    this.preguntaWrapper = new PreguntaWrapper();
    this.avatarWrapper = new AvatarWrapper();
    this.coleccionWrapper = new ColeccionWrapper();
    this.imgPerfilWrapper = new ImagenesPerfilWrapper();
  }

  //Obtenemos el componente modal para poder cerrarlo desde aquí
  @ViewChild('modalUploadRsc', { static: true }) modalUploadRsc: ModalContainerComponent;

  //Función para cerrar modal y devolverlo al estado inicial
  resetForm(){
    this.finishForm = false;
    this.respuestasForm = false;
    this.imgAvataresForm = false;
    this.cromosForm = false;

    this.typeQuestion = undefined;
    this.typeRscUpload = undefined;

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
      cont++;
    }

    if(this.coleccionWrapper.imagenColeccion != null){
      cont++;
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
      this.imgColeccion = null;
      this.coleccionWrapper.imagenColeccion = null;
      Swal.fire('Error', 'La imagen '+img.name + ' ya existe. Cambia el nombre al archivo y vuelve a intentarlo');
    }, (notFound) => {
      console.log('Se puede subir ', img.name);
      this.imgColeccion = new FormData();
      this.imgColeccion.append(img.name, img);
      this.coleccionWrapper.imagenColeccion = img.name;
      console.log('coleccion wrapper: ', this.coleccionWrapper);
    });
  }

  getImgDelanteCromos($event, numCromo){
    console.log('falta x desarrollar imagenes cromos (linea 579)');
  }

  getImgDetrasCromos($event, numCromo){
    console.log('falta x desarrollar imagenes cromos (linea 579)');
  }

  /* nombre: string;
  imagenDelante: string;
  imagenDetras: string;
  probabilidad: string;
  nivel: string;
  coleccionId: number; */
  getCromos(){
    let auxMap = new Map<number, Cromo[]>();
    let form = document.forms['cromosForm'];
    for (let i = 1; i < this.cromosMap.size + 1; i++) {
      if (form[i+'A'].value == "" || form[i+'parB'].value == "") {
        return null;
      } else {
        //auxMap.set(i, { "l": form[i+'A'].value, "r": form[i+'B'].value });
      }
    }
    console.log(auxMap);
    return auxMap;
  }

  addRowCromoForm(){
    let form = document.forms['cromosForm'];
    this.cromosMap.set(this.cromosMap.size + 1, new Array<Cromo>());
    let length = form.length;
    length = length + 1;
  }

  deleteRowCromoForm(){
    this.cromosMap.delete(this.cromosMap.size);
    let length = document.forms['parejasForm'].length;
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
            this.resetForm();
            Swal.fire('Hecho!', 'Pregunta subida con éxito.', 'success');
          }, (error) => {
            console.log(error);
            Swal.fire('Error', 'Error al subir pregunta', 'error');
          });
        } else {
          this.resetForm();
          Swal.fire('Hecho!', 'Pregunta subida con éxito.', 'success');
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
        this.avatarWrapper.complemento4
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
                  this.resetForm();
                  Swal.fire('Hecho!', 'Avatares subidos con éxito.', 'success');
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
          this.resetForm();
          Swal.fire('Hecho!', 'Avatares subidos con éxito.', 'success');
        }, (error) => {
          console.log(error);
          Swal.fire('Error', 'Error al subir imágenes', 'error');
        });
      })
    }
  }

  uploadColeccion(cromosForm){

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
  cromos: CromoWrapper[];

  constructor() {

    this.nombre = null;
    this.imagenColeccion = null;
    this.dosCaras = false;
    this.profesorId = null;
    this.cromos = [];
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
