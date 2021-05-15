export class Profesor {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  ImagenPerfil: string;
  Identificador: string; // lo usan los alumnos para asociarse a este profesor al registrarse
  id: number;
  userId: number;

  constructor(  Nombre?: string, PrimerApellido?: string, SegundoApellido?: string,
                ImagenPerfil?: string, Identificador?: string, id?: number, userId?: number) {

    this.Nombre = Nombre;
    this.PrimerApellido = PrimerApellido;
    this.SegundoApellido = SegundoApellido;
    this.ImagenPerfil = ImagenPerfil;
    this.Identificador = Identificador;
    this.id = id;
    this.userId = userId;
  }
}
