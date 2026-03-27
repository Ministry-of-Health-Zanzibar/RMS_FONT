import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkurugenziConversationComponent } from './mkurugenzi-conversation.component';

describe('MkurugenziConversationComponent', () => {
  let component: MkurugenziConversationComponent;
  let fixture: ComponentFixture<MkurugenziConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MkurugenziConversationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MkurugenziConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
