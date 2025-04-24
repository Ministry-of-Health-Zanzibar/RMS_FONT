import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddocumentTypeComponent } from './adddocument-type.component';

describe('AdddocumentTypeComponent', () => {
  let component: AdddocumentTypeComponent;
  let fixture: ComponentFixture<AdddocumentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdddocumentTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdddocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
