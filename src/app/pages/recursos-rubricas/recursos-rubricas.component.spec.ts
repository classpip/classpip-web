import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosRubricasComponent } from './recursos-rubricas.component';

describe('RecursosRubricasComponent', () => {
  let component: RecursosRubricasComponent;
  let fixture: ComponentFixture<RecursosRubricasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosRubricasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosRubricasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
