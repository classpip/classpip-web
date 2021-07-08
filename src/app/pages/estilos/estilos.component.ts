import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estilos',
  templateUrl: './estilos.component.html',
  styleUrls: ['./estilos.component.scss']
})
export class EstilosComponent implements OnInit {
  isCollapsed = true;
  constructor() { }

  ngOnInit(): void {
  }

}
