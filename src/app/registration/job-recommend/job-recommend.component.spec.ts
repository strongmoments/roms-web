import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRecommendComponent } from './job-recommend.component';

describe('JobRecommendComponent', () => {
  let component: JobRecommendComponent;
  let fixture: ComponentFixture<JobRecommendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobRecommendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobRecommendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
