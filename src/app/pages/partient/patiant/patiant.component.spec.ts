import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatiantComponent } from './patiant.component';

describe('PatiantComponent', () => {
  let component: PatiantComponent;
  let fixture: ComponentFixture<PatiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatiantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
