import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeChannelComponent } from './subscribe-channel.component';

describe('SubscribeChannelComponent', () => {
  let component: SubscribeChannelComponent;
  let fixture: ComponentFixture<SubscribeChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
