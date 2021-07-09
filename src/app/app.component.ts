import { SesionService } from 'src/app/services/sesion.service';
import { AuthService } from './services/auth.service';
import {
  Component,
  OnInit,
  Renderer2,
  HostListener,
  Inject
} from "@angular/core";
import { Location } from "@angular/common";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    public location: Location,
    private auth: AuthService,
    private sesion: SesionService,
    @Inject(DOCUMENT) document
  ) {}
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(e) {
    if (window.pageYOffset > 100) {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.remove("navbar-transparent");
        element.classList.add("bg-danger");
      }
    } else {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.add("navbar-transparent");
        element.classList.remove("bg-danger");
      }
    }
  }
  
  ngOnInit() {
    this.onWindowScroll(event);
    if(this.auth.isLoggedIn()){
      if(localStorage.getItem('ACCESS_TOKEN') != null){
        this.auth.getUserIdByToken(localStorage.getItem('ACCESS_TOKEN')).subscribe((data: any) => {
          this.auth.getProfesor(data.userId).subscribe((prof) => {
            let p = prof[0];
            this.sesion.EnviaProfesor(p);
            p.topic = "logged";
            this.sesion.publish(p);
            console.log('PROFESOR LOGUEADO: ', prof[0]);
          })
        })
      } else {
        this.auth.getUserIdByToken(sessionStorage.getItem('ACCESS_TOKEN')).subscribe((data: any) => {
          this.auth.getProfesor(data.userId).subscribe((prof) => {
            let p = prof[0];
            this.sesion.EnviaProfesor(p);
            p.topic = "logged";
            this.sesion.publish(p);
            console.log('PROFESOR LOGUEADO: ', prof[0]);
          })
        })
      }
    }
    
  }
}
