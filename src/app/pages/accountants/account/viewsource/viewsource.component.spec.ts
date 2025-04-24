import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsourceComponent } from './viewsource.component';

describe('ViewsourceComponent', () => {
  let component: ViewsourceComponent;
  let fixture: ComponentFixture<ViewsourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewsourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewsourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
