import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CviewHindranceComponent } from './cview-hindrance.component';

describe('CviewHindranceComponent', () => {
  let component: CviewHindranceComponent;
  let fixture: ComponentFixture<CviewHindranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CviewHindranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CviewHindranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
