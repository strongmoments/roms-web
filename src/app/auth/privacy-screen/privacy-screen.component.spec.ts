import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyScreenComponent } from './privacy-screen.component';

describe('PrivacyScreenComponent', () => {
  let component: PrivacyScreenComponent;
  let fixture: ComponentFixture<PrivacyScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
