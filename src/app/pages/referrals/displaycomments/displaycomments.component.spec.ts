import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaycommentsComponent } from './displaycomments.component';

describe('DisplaycommentsComponent', () => {
  let component: DisplaycommentsComponent;
  let fixture: ComponentFixture<DisplaycommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaycommentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaycommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
