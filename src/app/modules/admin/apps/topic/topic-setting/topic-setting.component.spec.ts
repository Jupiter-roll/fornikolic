import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSettingComponent } from './topic-setting.component';

describe('TopicSettingComponent', () => {
  let component: TopicSettingComponent;
  let fixture: ComponentFixture<TopicSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
