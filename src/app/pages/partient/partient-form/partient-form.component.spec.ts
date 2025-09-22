import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartientFormComponent } from './partient-form.component';

describe('PartientFormComponent', () => {
  let component: PartientFormComponent;
  let fixture: ComponentFixture<PartientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartientFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
