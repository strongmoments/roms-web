import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportScreenComponent } from './support-screen.component';

describe('SupportScreenComponent', () => {
  let component: SupportScreenComponent;
  let fixture: ComponentFixture<SupportScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
