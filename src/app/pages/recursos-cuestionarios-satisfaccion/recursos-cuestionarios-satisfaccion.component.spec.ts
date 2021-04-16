import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosCuestionariosSatisfaccionComponent } from './recursos-cuestionarios-satisfaccion.component';

describe('RecursosCuestionariosSatisfaccionComponent', () => {
  let component: RecursosCuestionariosSatisfaccionComponent;
  let fixture: ComponentFixture<RecursosCuestionariosSatisfaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosCuestionariosSatisfaccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosCuestionariosSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
