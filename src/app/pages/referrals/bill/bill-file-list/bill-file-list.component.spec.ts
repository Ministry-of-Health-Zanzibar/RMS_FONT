import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFileListComponent } from './bill-file-list.component';

describe('BillFileListComponent', () => {
  let component: BillFileListComponent;
  let fixture: ComponentFixture<BillFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillFileListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
