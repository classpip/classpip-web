import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosCuestionariosComponent } from './recursos-cuestionarios.component';

describe('RecursosCuestionariosComponent', () => {
  let component: RecursosCuestionariosComponent;
  let fixture: ComponentFixture<RecursosCuestionariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosCuestionariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosCuestionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
