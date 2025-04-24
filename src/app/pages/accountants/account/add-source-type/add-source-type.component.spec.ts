import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSourceTypeComponent } from './add-source-type.component';

describe('AddSourceTypeComponent', () => {
  let component: AddSourceTypeComponent;
  let fixture: ComponentFixture<AddSourceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSourceTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSourceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
