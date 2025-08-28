import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbodylistComponent } from './addbodylist.component';

describe('AddbodylistComponent', () => {
  let component: AddbodylistComponent;
  let fixture: ComponentFixture<AddbodylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddbodylistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddbodylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
