import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpartientComponent } from './addpartient.component';

describe('AddpartientComponent', () => {
  let component: AddpartientComponent;
  let fixture: ComponentFixture<AddpartientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddpartientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpartientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
