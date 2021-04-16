import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosEscenariosComponent } from './recursos-escenarios.component';

describe('RecursosEscenariosComponent', () => {
  let component: RecursosEscenariosComponent;
  let fixture: ComponentFixture<RecursosEscenariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosEscenariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosEscenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
