import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddocumentsComponent } from './adddocuments.component';

describe('AdddocumentsComponent', () => {
  let component: AdddocumentsComponent;
  let fixture: ComponentFixture<AdddocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdddocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdddocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
