import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recursos-list',
  templateUrl: './recursos-list.component.html',
  styleUrls: ['./recursos-list.component.scss']
})
export class RecursosListComponent implements OnInit {

  recurso: String;

  constructor(private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.recurso = this.activeRoute.snapshot.params.recurso;
  }

  volver(){
    this.router.navigateByUrl('/recursos');
  }

}
