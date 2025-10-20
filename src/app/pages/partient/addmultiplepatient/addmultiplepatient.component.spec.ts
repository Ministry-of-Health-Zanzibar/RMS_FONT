import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmultiplepatientComponent } from './addmultiplepatient.component';

describe('AddmultiplepatientComponent', () => {
  let component: AddmultiplepatientComponent;
  let fixture: ComponentFixture<AddmultiplepatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmultiplepatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmultiplepatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
