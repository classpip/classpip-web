import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from './helpers/auth.interceptor';


// import { BsDropdownModule } from "ngx-bootstrap/dropdown";
// import { ProgressbarModule } from "ngx-bootstrap/progressbar";
// import { TooltipModule } from "ngx-bootstrap/tooltip";
// import { CollapseModule } from "ngx-bootstrap/collapse";
// import { TabsModule } from "ngx-bootstrap/tabs";
// import { PaginationModule } from "ngx-bootstrap/pagination";
// import { AlertModule } from "ngx-bootstrap/alert";
// import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
// import { CarouselModule } from "ngx-bootstrap/carousel";
// import { ModalModule } from "ngx-bootstrap/modal";

import { PagesModule } from "./pages/pages.module";
import { TextareaAutosizeModule } from "ngx-textarea-autosize";
import { HttpModule } from "@angular/http";

// import { IndexComponent } from "./pages/index/index.component";
// import { ProfilepageComponent } from "./pages/examples/profilepage/profilepage.component";
// import { RegisterpageComponent } from "./pages/examples/registerpage/registerpage.component";
// import { LandingpageComponent } from "./pages/examples/landingpage/landingpage.component";
// import { NavbarComponent } from './shared/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    // BsDropdownModule.forRoot(),
    // ProgressbarModule.forRoot(),
    // TooltipModule.forRoot(),
    // CollapseModule.forRoot(),
    // TabsModule.forRoot(),
    PagesModule,
    // PaginationModule.forRoot(),
    // AlertModule.forRoot(),
    // BsDatepickerModule.forRoot(),
    // CarouselModule.forRoot(),
    // ModalModule.forRoot()
    TextareaAutosizeModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
