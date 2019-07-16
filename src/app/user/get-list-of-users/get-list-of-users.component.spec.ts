import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetListOfUsersComponent } from './get-list-of-users.component';

describe('GetListOfUsersComponent', () => {
  let component: GetListOfUsersComponent;
  let fixture: ComponentFixture<GetListOfUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetListOfUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetListOfUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
