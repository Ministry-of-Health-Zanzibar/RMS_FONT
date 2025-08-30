import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyListMoreComponent } from './body-list-more.component';

describe('BodyListMoreComponent', () => {
  let component: BodyListMoreComponent;
  let fixture: ComponentFixture<BodyListMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyListMoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyListMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
