import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePopupDialogComponent } from './leave-popup-dialog.component';

describe('LeavePopupDialogComponent', () => {
  let component: LeavePopupDialogComponent;
  let fixture: ComponentFixture<LeavePopupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavePopupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavePopupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
