import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwarddialogComponent } from './forwarddialog.component';

describe('ForwarddialogComponent', () => {
  let component: ForwarddialogComponent;
  let fixture: ComponentFixture<ForwarddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForwarddialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwarddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
