import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarAvataresComponent } from './mostrar-avatares.component';

describe('MostrarAvataresComponent', () => {
  let component: MostrarAvataresComponent;
  let fixture: ComponentFixture<MostrarAvataresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarAvataresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarAvataresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
