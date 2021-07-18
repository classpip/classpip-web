import { SesionService } from 'src/app/services/sesion.service';
import { Component, OnInit } from '@angular/core';
import { FamiliaAvatares } from 'src/app/clases/recursos/FamiliaAvatares';
import { Router } from '@angular/router';
import * as URL from 'src/app/URLs/urls';


@Component({
  selector: 'app-mostrar-avatares',
  templateUrl: './mostrar-avatares.component.html',
  styleUrls: ['./mostrar-avatares.component.scss']
})
export class MostrarAvataresComponent implements OnInit {

  familiaElegida: FamiliaAvatares;
  
  rutaImgAvatares = URL.ImagenesAvatares + '/download/';

  constructor(
    private sesion: SesionService,
    private router: Router) { }

  ngOnInit(): void {
    this.familiaElegida = this.sesion.DameFamilia ();  
  }

  goBack() {
    this.router.navigateByUrl('/recursos/avatares');
  }

}
