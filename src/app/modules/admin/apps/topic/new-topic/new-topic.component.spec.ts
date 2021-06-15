import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTopicComponent } from './new-topic.component';

describe('NewTopicComponent', () => {
  let component: NewTopicComponent;
  let fixture: ComponentFixture<NewTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
