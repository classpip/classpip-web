export class Profesor {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  imagenPerfil: string;
  identificador: string; // lo usan los alumnos para asociarse a este profesor al registrarse
  id: number;
  username: string;
  email: string;
  password: string;

  constructor(  username: string, email:string, password: string, Nombre: string, PrimerApellido: string, SegundoApellido?: string,
                ImagenPerfil?: string, Identificador?: string, id?: number) {

    this.nombre = Nombre;
    this.primerApellido = PrimerApellido;
    this.segundoApellido = SegundoApellido;
    this.imagenPerfil = ImagenPerfil;
    this.identificador = Identificador;
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.id = id;
  }
}
