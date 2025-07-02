import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReferalConfirmComponent } from './view-referal-confirm.component';

describe('ViewReferalConfirmComponent', () => {
  let component: ViewReferalConfirmComponent;
  let fixture: ComponentFixture<ViewReferalConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReferalConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReferalConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
