import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionBoardComponent } from './role-permission-board.component';

describe('RolePermissionBoardComponent', () => {
  let component: RolePermissionBoardComponent;
  let fixture: ComponentFixture<RolePermissionBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePermissionBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolePermissionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
