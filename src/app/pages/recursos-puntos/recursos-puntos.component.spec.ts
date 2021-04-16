import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosPuntosComponent } from './recursos-puntos.component';

describe('RecursosPuntosComponent', () => {
  let component: RecursosPuntosComponent;
  let fixture: ComponentFixture<RecursosPuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosPuntosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
