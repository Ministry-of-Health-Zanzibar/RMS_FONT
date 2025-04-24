import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSourceTypeComponent } from './view-source-type.component';

describe('ViewSourceTypeComponent', () => {
  let component: ViewSourceTypeComponent;
  let fixture: ComponentFixture<ViewSourceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSourceTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSourceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
