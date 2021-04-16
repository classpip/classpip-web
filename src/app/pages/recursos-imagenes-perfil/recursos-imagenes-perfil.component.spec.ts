import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosImagenesPerfilComponent } from './recursos-imagenes-perfil.component';

describe('RecursosImagenesPerfilComponent', () => {
  let component: RecursosImagenesPerfilComponent;
  let fixture: ComponentFixture<RecursosImagenesPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosImagenesPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosImagenesPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
