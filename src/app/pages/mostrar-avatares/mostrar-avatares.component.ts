import { ImagenesService } from './../../services/imagenes.service';
import { RecursosService } from './../../services/recursos.service';
import { SesionService } from 'src/app/services/sesion.service';
import { Component, OnInit } from '@angular/core';
import { FamiliaAvatares } from 'src/app/clases/recursos/FamiliaAvatares';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mostrar-avatares',
  templateUrl: './mostrar-avatares.component.html',
  styleUrls: ['./mostrar-avatares.component.scss']
})
export class MostrarAvataresComponent implements OnInit {

  familiaElegida: FamiliaAvatares;

  constructor(
    private sesion: SesionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.familiaElegida = this.sesion.DameFamilia ();    
  }

  goBack() {
    this.router.navigateByUrl('/recursos/avatares');
  }

}
