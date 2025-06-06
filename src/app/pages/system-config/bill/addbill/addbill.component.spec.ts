import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbillComponent } from './addbill.component';

describe('AddbillComponent', () => {
  let component: AddbillComponent;
  let fixture: ComponentFixture<AddbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddbillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
