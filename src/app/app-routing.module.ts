import { RecursosPuntosComponent } from './pages/recursos-puntos/recursos-puntos.component';
import { RecursosEscenariosComponent } from './pages/recursos-escenarios/recursos-escenarios.component';
import { RecursosAvataresComponent } from './pages/recursos-avatares/recursos-avatares.component';
import { RecursosRubricasComponent } from './pages/recursos-rubricas/recursos-rubricas.component';
import { RecursosImagenesPerfilComponent } from './pages/recursos-imagenes-perfil/recursos-imagenes-perfil.component';
import { RecursosCuestionariosSatisfaccionComponent } from './pages/recursos-cuestionarios-satisfaccion/recursos-cuestionarios-satisfaccion.component';
import { RecursosColeccionesComponent } from './pages/recursos-colecciones/recursos-colecciones.component';
import { RecursosCuestionariosComponent } from './pages/recursos-cuestionarios/recursos-cuestionarios.component';
import { RecursosPreguntasComponent } from './pages/recursos-preguntas/recursos-preguntas.component';
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

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent},
  { path: "que-es", component: QueEsClasspipComponent},
  { path: "funcionalidades", component: FuncionalidadesComponent},
  { path: "experiencias", component: ExperienciasComponent},
  { path: "recursos", component: RecursosComponent},
  { path: "estilos", component: EstilosComponent},
  { path: "desarrolladores", component: DesarrolladoresComponent},
  { path: "login", component: LoginComponent},
  { path: "register", component: RegisterComponent},
  { path: "index", component: IndexComponent},
  { path: "perfil", component: PerfilComponent},
  { path: "preguntas", component: RecursosPreguntasComponent},
  { path: "cuestionarios", component: RecursosCuestionariosComponent},
  { path: "colecciones", component: RecursosColeccionesComponent},
  { path: "puntos", component: RecursosPuntosComponent},
  { path: "escenarios", component: RecursosEscenariosComponent},
  { path: "avatares", component: RecursosAvataresComponent},
  { path: "rubricas", component: RecursosRubricasComponent},
  { path: "imagenes", component: RecursosImagenesPerfilComponent},
  { path: "satisfaccion", component: RecursosCuestionariosSatisfaccionComponent}
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
