import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueEsClasspipComponent } from './que-es-classpip.component';

describe('QueEsClasspipComponent', () => {
  let component: QueEsClasspipComponent;
  let fixture: ComponentFixture<QueEsClasspipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueEsClasspipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueEsClasspipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
