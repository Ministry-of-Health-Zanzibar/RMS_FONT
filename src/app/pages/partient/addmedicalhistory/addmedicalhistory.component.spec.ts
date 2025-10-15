import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmedicalhistoryComponent } from './addmedicalhistory.component';

describe('AddmedicalhistoryComponent', () => {
  let component: AddmedicalhistoryComponent;
  let fixture: ComponentFixture<AddmedicalhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmedicalhistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmedicalhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
