import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaymoredataComponent } from './displaymoredata.component';

describe('DisplaymoredataComponent', () => {
  let component: DisplaymoredataComponent;
  let fixture: ComponentFixture<DisplaymoredataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaymoredataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaymoredataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
