import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestartComponent } from './prestart.component';

describe('PrestartComponent', () => {
  let component: PrestartComponent;
  let fixture: ComponentFixture<PrestartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
