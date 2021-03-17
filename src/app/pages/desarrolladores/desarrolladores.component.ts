import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desarrolladores',
  templateUrl: './desarrolladores.component.html',
  styleUrls: ['./desarrolladores.component.scss']
})
export class DesarrolladoresComponent implements OnInit {
  isCollapsed = true;
  constructor() { }

  ngOnInit(): void {
  }

}
