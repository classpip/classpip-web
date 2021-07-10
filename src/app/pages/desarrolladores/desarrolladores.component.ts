import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desarrolladores',
  templateUrl: './desarrolladores.component.html',
  styleUrls: ['./desarrolladores.component.scss']
})
export class DesarrolladoresComponent implements OnInit {
  isCollapsed = true;
  constructor(private router: Router) { }

  urlDocumentacion = "https://demos.creative-tim.com/blk-design-system-angular/#/documentation/overview";

  ngOnInit(): void {
  }

  downloadManual(){}

  goDown(element){
    element.scrollIntoView({behavior: "smooth"});
  }
}
