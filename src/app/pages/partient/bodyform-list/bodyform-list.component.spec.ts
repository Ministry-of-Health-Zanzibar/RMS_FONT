import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyformListComponent } from './bodyform-list.component';

describe('BodyformListComponent', () => {
  let component: BodyformListComponent;
  let fixture: ComponentFixture<BodyformListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyformListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyformListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
