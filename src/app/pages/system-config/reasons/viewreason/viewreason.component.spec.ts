import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewreasonComponent } from './viewreason.component';

describe('ViewreasonComponent', () => {
  let component: ViewreasonComponent;
  let fixture: ComponentFixture<ViewreasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewreasonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewreasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
