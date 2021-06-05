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
  typeRscUpload;
  imagenes: FormData;
  uploadByJson: boolean;
  finishForm = false;

  //Variables wrappers para subir recursos (clases al final)
  preguntaWrapper: PreguntaWrapper;
  avatarWrapper;
  imgPerfilWrapper;
  coleccionWrapper;
  cromoWrapper;

  //Variables subir pregunta
  respuestasForm = false;
  typeQuestion: string;
  contOptions = 0;
  parejasMap = new Map<number, any>();
  pregunta: Pregunta;


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

    this.preguntaWrapper = new PreguntaWrapper();
  }

  uploadType() {
    if (this.form['typeRsc'].value != 'Seleccione un tipo de recurso...') {
      this.typeRscUpload = this.form['typeRsc'].value;
      console.log('typeRsc: ', this.typeRscUpload);
      if (document.getElementById('typeRsc').style.borderColor == "red")
        document.getElementById('typeRsc').style.borderColor = "#525f7f";
    } else {
      document.getElementById('typeRsc').style.borderColor = "red";
    }
  }

  uploadTypeQuestion() {

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

  getImagenPregunta($event) {

    let duplicated = false;
    let img = $event.target.files[0];

    console.log(img);

    this.imgService.checkImgNameDuplicated('ImagenesPreguntas').subscribe((data: Array<any>) => {
      if(data != null){
        console.log('files: ', data);
        data.forEach(file => {
          if(file.name == img.name){
            Swal.fire('Error', 'El nombre de la imagen ya existe. Renombra el fichero y vuelve a probar.', 'error');
            duplicated = true;
            this.preguntaWrapper.imagen = null;
          }
        });

        if(duplicated == false){
          this.imagenes = new FormData();
          this.imagenes.append(img.name, img);
          this.preguntaWrapper.imagen = img.name;
        }
      }
    }, (error) => {
      Swal.fire('Error', 'No se pueden subir imágenes ahora, pruebalo de nuevo más tarde.', 'error');
    });
  }

  activarImagenPregunta() {
    document.getElementById("imgPregunta").click();
  }

  /************************************ */
  // SUBIR RECURSO Y CANCELAR SUBIDA
  /************************************ */

  uploadResource() {

    this.form = document.forms['rscForm'];

    let questionForm = document.forms['preguntaForm'];

    console.log('Tipo recurso a subir: ' + this.typeRscUpload);

    if (this.typeRscUpload == 'Pregunta') {

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
          this.pregunta = new Pregunta(
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
          this.pregunta = new Pregunta(
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
          this.pregunta = new Pregunta(
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
          this.pregunta = new Pregunta(
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

      if (this.pregunta != undefined) {
        console.log('upload rsc: ', this.pregunta);
        this.rscService.uploadPregunta(this.pregunta).subscribe((data) => {
          console.log('respuesta subir pregunta: ', data);
          if(this.pregunta.imagen != null){
            this.imgService.uploadImgPregunta(this.imagenes).subscribe(() => {
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
  }


  @ViewChild('modalUploadRsc', { static: true }) modalUploadRsc: ModalContainerComponent;

  resetForm(){
    this.finishForm = false;
    this.respuestasForm = false;
    this.typeQuestion = undefined;
    this.typeRscUpload = undefined;
    this.form.reset();
    this.modalUploadRsc.hide();
  }

}

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

class ImagenesPerfilWrapper {
  nombreFamilia: string;
  numeroImagenes: number;
  imagenes: string[];
  profesorId: number;

  constructor() {
    this.nombreFamilia = null;
    this.numeroImagenes = null;
    this.imagenes = [];
    this.profesorId = null;
  }
}

class ColeccionWrapper {
  nombre: string;
  imagenColeccion: string;
  dosCaras: boolean;
  profesorId: number;
  cromos: [];

  constructor() {

    this.nombre = null;
    this.imagenColeccion = null;
    this.dosCaras = null;
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
