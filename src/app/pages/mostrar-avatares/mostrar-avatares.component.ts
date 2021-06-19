import { ImagenesService } from 'src/app/services/imagenes.service';
import { RecursosService } from './../../services/recursos.service';
import { SesionService } from 'src/app/services/sesion.service';
import { Component, OnInit } from '@angular/core';
import { FamiliaAvatares } from 'src/app/clases/recursos/FamiliaAvatares';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as URL from 'src/app/URLs/urls';


@Component({
  selector: 'app-mostrar-avatares',
  templateUrl: './mostrar-avatares.component.html',
  styleUrls: ['./mostrar-avatares.component.scss']
})
export class MostrarAvataresComponent implements OnInit {

  familiaElegida: FamiliaAvatares;
  
  rutaImgAvatares = URL.ImagenesAvatares;

  constructor(
    private sesion: SesionService,
    private router: Router,
    private imgService: ImagenesService
  ) { }

  ngOnInit(): void {
    this.familiaElegida = this.sesion.DameFamilia ();  
    // if(this.familiaElegida != null){
    //   this.getImagenesFamilia();
    // }
  }

  // getImagenesFamilia(){
  //   try{
  //     this.imgService.downloadImgAvatar(this.familiaElegida.silueta).subscribe((data: any) => {
  //       this.imagenes.append(this.familiaElegida.silueta, data);
  //     });
      
  //     this.familiaElegida.complemento1.forEach(img => {
  //       this.imgService.downloadImgAvatar(img).subscribe((data) => {
  //         this.imagenes.append(img, data);
  //       })
  //     });

  //     this.familiaElegida.complemento2.forEach(img => {
  //       this.imgService.downloadImgAvatar(img).subscribe((data) => {
  //         this.imagenes.append(img, data);
  //       })
  //     });

  //     this.familiaElegida.complemento3.forEach(img => {
  //       this.imgService.downloadImgAvatar(img).subscribe((data) => {
  //         this.imagenes.append(img, data);
  //       })
  //     });

  //     this.familiaElegida.complemento4.forEach(img => {
  //       this.imgService.downloadImgAvatar(img).subscribe((data) => {
  //         this.imagenes.append(img, data);
  //       })
  //     });

  //   } catch(error) {
  //     console.log(error);
  //     this.imagenes = new FormData();
  //   }
    
  // }

  goBack() {
    this.router.navigateByUrl('/recursos/avatares');
  }

}
