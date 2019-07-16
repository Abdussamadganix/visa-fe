import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiwMerchantComponent } from './veiw-merchant.component';

describe('VeiwMerchantComponent', () => {
  let component: VeiwMerchantComponent;
  let fixture: ComponentFixture<VeiwMerchantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VeiwMerchantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VeiwMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
