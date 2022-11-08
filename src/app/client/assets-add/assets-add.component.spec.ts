import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAddComponent } from './assets-add.component';

describe('AssetsAddComponent', () => {
  let component: AssetsAddComponent;
  let fixture: ComponentFixture<AssetsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
