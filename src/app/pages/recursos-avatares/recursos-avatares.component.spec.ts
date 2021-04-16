import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosAvataresComponent } from './recursos-avatares.component';

describe('RecursosAvataresComponent', () => {
  let component: RecursosAvataresComponent;
  let fixture: ComponentFixture<RecursosAvataresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosAvataresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosAvataresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
