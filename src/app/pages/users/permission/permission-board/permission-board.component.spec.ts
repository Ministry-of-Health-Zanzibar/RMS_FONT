import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionBoardComponent } from './permission-board.component';

describe('PermissionBoardComponent', () => {
  let component: PermissionBoardComponent;
  let fixture: ComponentFixture<PermissionBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
