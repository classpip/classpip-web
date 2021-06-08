export class FamiliaDeImagenesDePerfil {
  nombreFamilia: string;
  numeroImagenes: number;
  imagenes: string[];
  profesorId: number;
  id: number;

  constructor(nombreFamilia: string, numeroImagenes: number, imagenes: string[], profesor: number) {
    this.nombreFamilia = nombreFamilia;
    this.numeroImagenes = numeroImagenes;
    this.imagenes = imagenes;
    this.profesorId = profesor;
  }
}
