import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTransferFormComponent } from './employee-transfer-form.component';

describe('EmployeeTransferFormComponent', () => {
  let component: EmployeeTransferFormComponent;
  let fixture: ComponentFixture<EmployeeTransferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTransferFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTransferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
