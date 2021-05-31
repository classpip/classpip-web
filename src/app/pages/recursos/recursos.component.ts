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

  isLogged;

  profesor;

  form;
  respuestasForm = false;
  finishForm = false;
  typeRscUpload;
  typeQuestion;
  uploadByJson: boolean;
  parejasMap = new Map<number, any>();
  preguntaWrapper;
  pregunta: Pregunta;
  contOptions = 0;
  imgPregunta/* : FormData */;
  imgPreguntaName: string;


  constructor(private auth: AuthService, private router: Router, private sesion: SesionService, private rscService: RecursosService) { }

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

    this.preguntaWrapper = {
      Titulo: null,
      Tipo: null,
      Pregunta: null,
      Tematica: null,
      Imagen: null,
      FeedbackCorrecto: null,
      FeedbackIncorrecto: null,
      RespuestaCorrecta: null,
      RespuestaIncorrecta1: null,
      RespuestaIncorrecta2: null,
      RespuestaIncorrecta3: null,
      Emparejamientos: [],
      profesorId: 0
    }
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
      this.preguntaWrapper.Titulo = this.form['tituloPregunta'].value;

      if (this.form['tipoPregunta'].value != 'Seleccione un tipo...') {
        this.typeQuestion = this.form['tipoPregunta'].value;
        console.log('typequestion: ', this.typeQuestion);
        this.preguntaWrapper.Tipo = this.form['tipoPregunta'].value;
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
      this.preguntaWrapper.Tematica = questionForm['tematica'].value;
      cont++;
    } else {
      document.getElementById('tematica').style.borderColor = "red";
    }

    if (questionForm['pregunta'].value != '') {
      if (document.getElementById('pregunta').style.borderColor == "red")
        document.getElementById('pregunta').style.borderColor = "#525f7f";
      this.preguntaWrapper.Pregunta = questionForm['pregunta'].value;
      cont++;
    } else {
      document.getElementById('pregunta').style.borderColor = "red";
    }

    if (questionForm['feedback1'].value != '') {
      if (document.getElementById('feedback1').style.borderColor == "red")
        document.getElementById('feedback1').style.borderColor = "#525f7f";
      this.preguntaWrapper.FeedbackCorrecto = questionForm['feedback1'].value;
      cont++;
    } else {
      document.getElementById('feedback1').style.borderColor = "red";
    }

    if (questionForm['feedback2'].value != '') {
      if (document.getElementById('feedback2').style.borderColor == "red")
        document.getElementById('feedback2').style.borderColor = "#525f7f";
      this.preguntaWrapper.FeedbackIncorrecto = questionForm['feedback2'].value;
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

    let img = $event.target.files[0];

    console.log(img);

    console.log('imagen pregunta: ', img.name);

    this.imgPregunta = new FormData();
    this.imgPregunta.append(img.name, img);
    this.imgPreguntaName = img.name;
    
    // const reader = new FileReader();
    // reader.readAsDataURL(img);
    // reader.onload = () => {
    //   console.log('carga imagen');
    //   this.imgPregunta = reader.result.toString();
    // }
    

    console.log('imagen a subir: ', this.imgPregunta);



    // const imagenPreguntaData: FormData = new FormData();
    //         imagenPreguntaData.append(this.filePregunta.name, this.filePregunta);
    //         this.peticionesAPI.PonImagenPregunta(imagenPreguntaData)
    //         .subscribe();
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

      if (this.imgPreguntaName != undefined){
        this.preguntaWrapper.Imagen = this.imgPreguntaName;
      }

      console.log('Tipo pregunta a subir: ', this.typeQuestion);
      if (this.typeQuestion == 'Respuesta abierta') {

        let contOpen = this.getCommonFieldPreguntas();

        if (questionForm['respAbierta'].value != '') {
          if (document.getElementById('respAbierta').style.borderColor == "red")
            document.getElementById('respAbierta').style.borderColor = "#525f7f";
          this.preguntaWrapper.RespuestaCorrecta = questionForm['respAbierta'].value;
          contOpen++;
        } else {
          document.getElementById('respAbierta').style.borderColor = "red";
        }

        if (contOpen == 5) {
          this.pregunta = new Pregunta(
            this.preguntaWrapper.Titulo,
            this.preguntaWrapper.Tipo,
            this.preguntaWrapper.Pregunta,
            this.preguntaWrapper.Tematica,
            this.preguntaWrapper.FeedbackCorrecto,
            this.preguntaWrapper.FeedbackIncorrecto,
            this.profesor.id,
            this.preguntaWrapper.Imagen,
            null,
            this.preguntaWrapper.RespuestaCorrecta
          );
        }
      } else if (this.typeQuestion == 'Cuatro opciones') {
        let contOptions = this.contOptions;

        if (questionForm['respOpciones'].value != '') {
          if (document.getElementById('respOpciones').style.borderColor == "red")
            document.getElementById('respOpciones').style.borderColor = "#525f7f";
          this.preguntaWrapper.RespuestaCorrecta = questionForm['respOpciones'].value;
          contOptions++;
        } else {
          document.getElementById('respOpciones').style.borderColor = "red";
        }

        if (questionForm['respInc1'].value != '') {
          if (document.getElementById('respInc1').style.borderColor == "red")
            document.getElementById('respInc1').style.borderColor = "#525f7f";
          this.preguntaWrapper.RespuestaIncorrecta1 = questionForm['respInc1'].value;
          contOptions++;
        } else {
          document.getElementById('respInc1').style.borderColor = "red";
        }

        if (questionForm['respInc2'].value != '') {
          if (document.getElementById('respInc2').style.borderColor == "red")
            document.getElementById('respInc2').style.borderColor = "#525f7f";
          this.preguntaWrapper.RespuestaIncorrecta2 = questionForm['respInc2'].value;
          contOptions++;
        } else {
          document.getElementById('respInc2').style.borderColor = "red";
        }

        if (questionForm['respInc3'].value != '') {
          if (document.getElementById('respInc3').style.borderColor == "red")
            document.getElementById('respInc3').style.borderColor = "#525f7f";
          this.preguntaWrapper.RespuestaIncorrecta3 = questionForm['respInc3'].value;
          contOptions++;
        } else {
          document.getElementById('respInc3').style.borderColor = "red";
        }

        console.log('wrapper final 4opt: ', this.preguntaWrapper);
        console.log('cont options: ', contOptions);
        if (contOptions == 8) {
          this.pregunta = new Pregunta(
            this.preguntaWrapper.Titulo,
            this.preguntaWrapper.Tipo,
            this.preguntaWrapper.Pregunta,
            this.preguntaWrapper.Tematica,
            this.preguntaWrapper.FeedbackCorrecto,
            this.preguntaWrapper.FeedbackIncorrecto,
            this.profesor.id,
            this.preguntaWrapper.Imagen,
            [],
            this.preguntaWrapper.RespuestaCorrecta,
            this.preguntaWrapper.RespuestaIncorrecta1,
            this.preguntaWrapper.RespuestaIncorrecta2,
            this.preguntaWrapper.RespuestaIncorrecta3
          );
        }

      } else if (this.typeQuestion == 'Verdadero o falso') {

        let contVoF = this.getCommonFieldPreguntas();

        if (questionForm['respVoF'].value != '') {
          if (document.getElementById('respVoF').style.borderColor == "red")
            document.getElementById('respVoF').style.borderColor = "#525f7f";
          this.preguntaWrapper.RespuestaCorrecta = questionForm['respVoF'].value;
          contVoF++;
        } else {
          document.getElementById('respVoF').style.borderColor = "red";
        }

        if (contVoF == 5) {
          this.pregunta = new Pregunta(
            this.preguntaWrapper.Titulo,
            this.preguntaWrapper.Tipo,
            this.preguntaWrapper.Pregunta,
            this.preguntaWrapper.Tematica,
            this.preguntaWrapper.FeedbackCorrecto,
            this.preguntaWrapper.FeedbackIncorrecto,
            this.profesor.id,
            this.preguntaWrapper.Imagen,
            null,
            this.preguntaWrapper.RespuestaCorrecta
          );
        }
      } else if (this.typeQuestion == 'Emparejamiento') {

        if (this.getParejasValues() != null) {
          this.pregunta = new Pregunta(
            this.preguntaWrapper.Titulo,
            this.preguntaWrapper.Tipo,
            this.preguntaWrapper.Pregunta,
            this.preguntaWrapper.Tematica,
            this.preguntaWrapper.FeedbackCorrecto,
            this.preguntaWrapper.FeedbackIncorrecto,
            this.profesor.id,
            this.preguntaWrapper.Imagen,
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
          if (this.imgPreguntaName != undefined) {
            this.rscService.uploadImgPregunta(this.imgPregunta).subscribe(() => {
              Swal.fire('Hecho!', 'Pregunta subida con éxito.', 'success');
              this.resetForm();
            }, (error) => {
              console.log(error);
              Swal.fire('Error', 'Error al subir pregunta', 'error').then(() => {
                this.resetForm();
              });
            });
          } else {
            Swal.fire('Hecho!', 'Pregunta subida con éxito.', 'success');
            this.resetForm();
          }
        }, (error) => {
          console.log(error);
          Swal.fire('Error', 'Error al subir pregunta', 'error').then(() => {
            this.resetForm();
          });
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
