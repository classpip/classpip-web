import { Component, OnInit, OnDestroy} from '@angular/core';
import noUiSlider from "nouislider";

@Component({
  selector: 'app-recursos-avatares',
  templateUrl: './recursos-avatares.component.html',
  styleUrls: ['./recursos-avatares.component.scss']
})
export class RecursosAvataresComponent implements OnInit {
  
  isCollapsed = true;
  focus;
  focus1;
  focus2;
  date = new Date();
  pagination = 3;
  pagination1 = 1;
  constructor() {}
  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  
  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }
}


