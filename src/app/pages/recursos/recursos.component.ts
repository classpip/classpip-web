import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FamiliaAvatares } from './../../clases/recursos/FamiliaAvatares';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { SesionService } from 'src/app/services/sesion.service';
import Swal from 'sweetalert2';


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
  typeRscUpload;
  uploadByJson: boolean;

  constructor(private auth:AuthService, private router: Router,  private sesion: SesionService) { }

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
  }

  uploadType(){
    if(this.form['typeRsc'].value != 'Seleccione un tipo de recurso...'){
      this.typeRscUpload = this.form['typeRsc'].value;
      if(document.getElementById('typeRsc').style.borderColor == "red")
        document.getElementById('typeRsc').style.borderColor ="#525f7f";
    } else {
      document.getElementById('typeRsc').style.borderColor ="red";
    }
  }

  // checkJsonOrForm(){
  //   this.uploadByJson = this.form['jsonCheck'].value;
  // }

  uploadResource(){
    
    this.form = document.forms['rscForm'];

    this.typeRscUpload = this.form['typeRsc'].value;
    console.log('Tipo recurso a subir: '+this.form['typeRsc'].value);


    if(this.typeRscUpload != 'Seleccione un tipo de recurso...'){
    } else {
      Swal.fire('Error', 'error', 'error');
    }
  }

  resetForm(){
    this.form.reset();
    document.getElementById('typeRsc').style.borderColor ="#525f7f";
  }

}
