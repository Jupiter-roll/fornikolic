import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicStatusComponent } from './topic-status.component';

describe('TopicStatusComponent', () => {
  let component: TopicStatusComponent;
  let fixture: ComponentFixture<TopicStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
