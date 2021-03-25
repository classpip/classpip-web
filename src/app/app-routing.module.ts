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
  { path: "perfil", component: PerfilComponent}
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
