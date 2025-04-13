import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReferalTypeComponent } from './view-referal-type.component';

describe('ViewReferalTypeComponent', () => {
  let component: ViewReferalTypeComponent;
  let fixture: ComponentFixture<ViewReferalTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReferalTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReferalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
