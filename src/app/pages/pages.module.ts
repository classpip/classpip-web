import { NavbarComponent } from '../shared/navbar/navbar.component';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { ModalModule } from "ngx-bootstrap/modal";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { PopoverModule } from "ngx-bootstrap/popover";

import { IndexComponent } from "./index/index.component";
import { ProfilepageComponent } from "./examples/profilepage/profilepage.component";
import { RegisterpageComponent } from "./examples/registerpage/registerpage.component";
import { LandingpageComponent } from "./examples/landingpage/landingpage.component";
import { HomeComponent } from './home/home.component';
import { QueEsClasspipComponent } from './que-es-classpip/que-es-classpip.component';
import { FuncionalidadesComponent } from './funcionalidades/funcionalidades.component';
import { DesarrolladoresComponent } from './desarrolladores/desarrolladores.component';
import { RecursosComponent } from './recursos/recursos.component';
import { ExperienciasComponent } from './experiencias/experiencias.component';
import { EstilosComponent } from './estilos/estilos.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RecursosListComponent } from './recursos-list/recursos-list.component';
import { MostrarCuestionarioComponent } from './mostrar-cuestionario/mostrar-cuestionario.component';
import { MostrarColeccionesComponent } from './mostrar-colecciones/mostrar-colecciones.component';
import { MostrarAvataresComponent } from './mostrar-avatares/mostrar-avatares.component';
import { MostrarImagenesPerfilComponent } from './mostrar-imagenes-perfil/mostrar-imagenes-perfil.component';



@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    JwBootstrapSwitchNg2Module,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    IndexComponent,
    ProfilepageComponent,
    RegisterpageComponent,
    LandingpageComponent,
    HomeComponent,
    QueEsClasspipComponent,
    FuncionalidadesComponent,
    DesarrolladoresComponent,
    RecursosComponent,
    RecursosListComponent,
    ExperienciasComponent,
    EstilosComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    PerfilComponent,
    MostrarCuestionarioComponent,
    MostrarColeccionesComponent,
    MostrarAvataresComponent,
    MostrarImagenesPerfilComponent,
  ],
  exports: [
    IndexComponent,
    ProfilepageComponent,
    RegisterpageComponent,
    LandingpageComponent
  ],
  providers: []
})
export class PagesModule {}
