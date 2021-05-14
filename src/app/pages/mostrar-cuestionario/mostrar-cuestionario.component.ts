import { RecursosService } from './../../services/recursos.service';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from './../../services/auth.service';
import { SesionService } from './../../services/sesion.service';
import { Component, OnInit } from '@angular/core';
import { Cuestionario } from 'src/app/clases/recursos/Cuestionario';
import { Pregunta } from 'src/app/clases/recursos/Pregunta';

import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-cuestionario',
  templateUrl: './mostrar-cuestionario.component.html',
  styleUrls: ['./mostrar-cuestionario.component.scss']
})
export class MostrarCuestionarioComponent implements OnInit {

  cuestinarioSeleccionado: Cuestionario;
  profesorId: number;
  preguntasCuestionarioSeleccionado: Pregunta[];

  //PROPIEDADES DEL CUESTIONARIO
  titulo: string;
  descripcion: string;

  //PARAMETROS DE LA TABLA
  dataSource;
  displayedColumns: string[] = ['tituloPregunta', 'preguntaPregunta', 'tematicaPregunta'];

  constructor(public sesion: SesionService,
    public auth: AuthService,
    public recursos: RecursosService,
    private location: Location) { }

  ngOnInit(): void {
     //Recogemos la informacion de la sesion
     this.cuestinarioSeleccionado = this.sesion.DameCuestionario();
     console.log("Cuestionario: ", this.cuestinarioSeleccionado);
     //this.profesorId = this.auth.getProfesorId();
     this.recursos.DamePreguntasCuestionario(this.cuestinarioSeleccionado.id)     
     .subscribe((res) => {
       this.preguntasCuestionarioSeleccionado = res;
       this.dataSource = new MatTableDataSource(this.preguntasCuestionarioSeleccionado);
       console.log("Preguntas:", this.preguntasCuestionarioSeleccionado);
     });
 
     //Establecemos el valor que le corresponde a los inputs
     this.titulo = this.cuestinarioSeleccionado.Titulo;
     this.descripcion = this.cuestinarioSeleccionado.Descripcion;
   }
 
 // Nos devolvera a mis cuestionarios
   goBack() {
     this.location.back();
   }
  }

