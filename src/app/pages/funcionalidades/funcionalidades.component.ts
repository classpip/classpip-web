import { Component, OnInit } from '@angular/core';
import *  as URL from "src/app/URLs/urls"

@Component({
  selector: 'app-funcionalidades',
  templateUrl: './funcionalidades.component.html',
  styleUrls: ['./funcionalidades.component.scss']
})
export class FuncionalidadesComponent implements OnInit {
  isCollapsed = true;
  constructor() { }

  ngOnInit(): void {
  }

  goJuegoRapido(){
    //Sustituir por url cuando este classpip express disponible
    window.open(URL.expressProd);
  }

}
