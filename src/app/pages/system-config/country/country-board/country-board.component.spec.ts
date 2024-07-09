import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryBoardComponent } from './country-board.component';

describe('CountryBoardComponent', () => {
  let component: CountryBoardComponent;
  let fixture: ComponentFixture<CountryBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
