import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestartReportComponent } from './prestart-report.component';

describe('PrestartReportComponent', () => {
  let component: PrestartReportComponent;
  let fixture: ComponentFixture<PrestartReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestartReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestartReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
