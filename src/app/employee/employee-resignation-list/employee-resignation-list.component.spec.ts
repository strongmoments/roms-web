import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeResignationListComponent } from './employee-resignation-list.component';

describe('EmployeeResignationListComponent', () => {
  let component: EmployeeResignationListComponent;
  let fixture: ComponentFixture<EmployeeResignationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeResignationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeResignationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
