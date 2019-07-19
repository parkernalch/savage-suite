import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CviewEdgeComponent } from './cview-edge.component';

describe('CviewEdgeComponent', () => {
  let component: CviewEdgeComponent;
  let fixture: ComponentFixture<CviewEdgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CviewEdgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CviewEdgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
