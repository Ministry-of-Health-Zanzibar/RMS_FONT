import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardedOutLetterComponent } from './boarded-out-letter.component';

describe('BoardedOutLetterComponent', () => {
  let component: BoardedOutLetterComponent;
  let fixture: ComponentFixture<BoardedOutLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardedOutLetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardedOutLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
