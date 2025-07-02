import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewinsurancesComponent } from './viewinsurances.component';

describe('ViewinsurancesComponent', () => {
  let component: ViewinsurancesComponent;
  let fixture: ComponentFixture<ViewinsurancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewinsurancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewinsurancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
