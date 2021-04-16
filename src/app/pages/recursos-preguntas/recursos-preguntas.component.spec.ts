import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosPreguntasComponent } from './recursos-preguntas.component';

describe('RecursosPreguntasComponent', () => {
  let component: RecursosPreguntasComponent;
  let fixture: ComponentFixture<RecursosPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosPreguntasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
