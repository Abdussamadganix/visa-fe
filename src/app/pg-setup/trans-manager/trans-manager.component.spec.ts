import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransManagerComponent } from './trans-manager.component';

describe('TransManagerComponent', () => {
  let component: TransManagerComponent;
  let fixture: ComponentFixture<TransManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
