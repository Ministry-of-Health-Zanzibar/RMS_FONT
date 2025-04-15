import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbillComponent } from './viewbill.component';

describe('ViewbillComponent', () => {
  let component: ViewbillComponent;
  let fixture: ComponentFixture<ViewbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewbillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
