import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosColeccionesComponent } from './recursos-colecciones.component';

describe('RecursosColeccionesComponent', () => {
  let component: RecursosColeccionesComponent;
  let fixture: ComponentFixture<RecursosColeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosColeccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosColeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
