import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarColeccionesComponent } from './mostrar-colecciones.component';

describe('MostrarColeccionesComponent', () => {
  let component: MostrarColeccionesComponent;
  let fixture: ComponentFixture<MostrarColeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarColeccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarColeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
