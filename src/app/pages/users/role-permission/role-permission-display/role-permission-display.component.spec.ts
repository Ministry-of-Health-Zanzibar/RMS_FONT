import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionDisplayComponent } from './role-permission-display.component';

describe('RolePermissionDisplayComponent', () => {
  let component: RolePermissionDisplayComponent;
  let fixture: ComponentFixture<RolePermissionDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePermissionDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolePermissionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
