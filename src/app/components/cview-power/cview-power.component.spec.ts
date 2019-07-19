import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CviewPowerComponent } from './cview-power.component';

describe('CviewPowerComponent', () => {
  let component: CviewPowerComponent;
  let fixture: ComponentFixture<CviewPowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CviewPowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CviewPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
