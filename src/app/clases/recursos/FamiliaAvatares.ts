export class FamiliaAvatares {

  nombreFamilia: string;
  silueta: string;
  nombreComplemento1: string;
  complemento1: string[];
  nombreComplemento2: string;
  complemento2: string[];
  nombreComplemento3: string;
  complemento3: string[];
  nombreComplemento4: string;
  complemento4: string[];
  profesorId: number;
  id: number;
  propietario: string;

  recomendacion: string;

  constructor(nombre: string, profesorId: number, silueta?: string, nombreComplemento1?: string, complemento1?: string[], nombreComplemento2?: string, complemento2?: string[], nombreComplemento3?: string, complemento3?: string[], nombreComplemento4?: string, complemento4?: string[], recomendacion?: string) {

    this.nombreFamilia = nombre;
    this.profesorId = profesorId;
    this.silueta = silueta;
    this.nombreComplemento1 = nombreComplemento1;
    this.nombreComplemento2 = nombreComplemento2;
    this.nombreComplemento3 = nombreComplemento3;
    this.nombreComplemento4 = nombreComplemento4;
    this.complemento1 = complemento1;
    this.complemento2 = complemento2;
    this.complemento3 = complemento3;
    this.complemento4 = complemento4;
    this.recomendacion = recomendacion;
  }

}
