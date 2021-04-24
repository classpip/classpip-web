import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FamiliaAvatares } from './../../clases/FamiliaAvatares';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {
  isCollapsed = true;

 

  constructor(private authService:AuthService, private router: Router) { }

  ngOnInit(): void {
   

  }

}
