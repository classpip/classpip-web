import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desarrolladores',
  templateUrl: './desarrolladores.component.html',
  styleUrls: ['./desarrolladores.component.scss']
})
export class DesarrolladoresComponent implements OnInit {
  isCollapsed = true;
  constructor() { }

  urlPlantilla = "https://demos.creative-tim.com/blk-design-system-angular/#/home";
  urlDocumentacion = "https://demos.creative-tim.com/blk-design-system-angular/#/documentation/overview";

  ngOnInit(): void {
  }

  redirectPlantilla() {
    window.open(this.urlPlantilla);
  }

  downloadManual(){}

  goDown(element){
    element.scrollIntoView({behavior: "smooth"});
  }
}
