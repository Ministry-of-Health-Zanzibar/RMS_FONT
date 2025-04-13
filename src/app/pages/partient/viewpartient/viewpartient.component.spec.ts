import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpartientComponent } from './viewpartient.component';

describe('ViewpartientComponent', () => {
  let component: ViewpartientComponent;
  let fixture: ComponentFixture<ViewpartientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewpartientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewpartientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
