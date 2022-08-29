import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRegignationComponent } from './employee-regignation.component';

describe('EmployeeRegignationComponent', () => {
  let component: EmployeeRegignationComponent;
  let fixture: ComponentFixture<EmployeeRegignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeRegignationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeRegignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
