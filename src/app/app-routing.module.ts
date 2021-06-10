import { LandingpageComponent } from './pages/examples/landingpage/landingpage.component';
import { MostrarCuestionarioComponent } from './pages/mostrar-cuestionario/mostrar-cuestionario.component';
import { RecursosListComponent } from './pages/recursos-list/recursos-list.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { DesarrolladoresComponent } from './pages/desarrolladores/desarrolladores.component';
import { EstilosComponent } from './pages/estilos/estilos.component';
import { RecursosComponent } from './pages/recursos/recursos.component';
import { ExperienciasComponent } from './pages/experiencias/experiencias.component';
import { FuncionalidadesComponent } from './pages/funcionalidades/funcionalidades.component';
import { QueEsClasspipComponent } from './pages/que-es-classpip/que-es-classpip.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./pages/index/index.component";
import { MostrarColeccionesComponent } from './pages/mostrar-colecciones/mostrar-colecciones.component';
import { MostrarAvataresComponent } from './pages/mostrar-avatares/mostrar-avatares.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent},
  { path: "que-es", component: QueEsClasspipComponent},
  { path: "funcionalidades", component: FuncionalidadesComponent},
  { path: "experiencias", component: ExperienciasComponent},
  { path: "recursos", component: RecursosComponent},
  { path: "recursos/:recurso", component: RecursosListComponent},
  { path: "recursos/cuestionarios/:id", component: MostrarCuestionarioComponent},
  { path: "recursos/colecciones/:id", component: MostrarColeccionesComponent},
  { path: "recursos/avatares/:id", component: MostrarAvataresComponent},
  { path: "estilos", component: EstilosComponent},
  { path: "desarrolladores", component: DesarrolladoresComponent},
  { path: "login", component: LoginComponent},
  { path: "register", component: RegisterComponent},
  { path: "index", component: IndexComponent},
  { path: "perfil", component: PerfilComponent},
  { path: "landing", component: LandingpageComponent},
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: []
})
export class AppRoutingModule {}
