import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-experiencias',
  templateUrl: './experiencias.component.html',
  styleUrls: ['./experiencias.component.scss']
})
export class ExperienciasComponent implements OnInit {
  isCollapsed = true
  focus2;
  constructor() { }

  ngOnInit(): void {
    document.getElementById("sendBtn").addEventListener ("click", this.send, false);
  }

  send(){
    if((<HTMLInputElement>document.getElementById("comentario")).value.length != 0){
      const comentario = (<HTMLInputElement>document.getElementById("comentario")).value;
      console.log(comentario);
    }
  }

}
