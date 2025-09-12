import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintfollowupComponent } from './printfollowup.component';

describe('PrintfollowupComponent', () => {
  let component: PrintfollowupComponent;
  let fixture: ComponentFixture<PrintfollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintfollowupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintfollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
