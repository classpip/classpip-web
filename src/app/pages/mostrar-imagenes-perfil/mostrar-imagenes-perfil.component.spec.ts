import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarImagenesPerfilComponent } from './mostrar-imagenes-perfil.component';

describe('MostrarImagenesPerfilComponent', () => {
  let component: MostrarImagenesPerfilComponent;
  let fixture: ComponentFixture<MostrarImagenesPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarImagenesPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarImagenesPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
