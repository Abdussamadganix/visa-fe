import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgSetupComponent } from './pg-setup.component';

describe('PgSetupComponent', () => {
  let component: PgSetupComponent;
  let fixture: ComponentFixture<PgSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
