import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsourceComponent } from './addsource.component';

describe('AddsourceComponent', () => {
  let component: AddsourceComponent;
  let fixture: ComponentFixture<AddsourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddsourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
