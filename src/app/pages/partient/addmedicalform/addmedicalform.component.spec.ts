import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmedicalformComponent } from './addmedicalform.component';

describe('AddmedicalformComponent', () => {
  let component: AddmedicalformComponent;
  let fixture: ComponentFixture<AddmedicalformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmedicalformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmedicalformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
