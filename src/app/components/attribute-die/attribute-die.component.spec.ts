import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeDieComponent } from './attribute-die.component';

describe('AttributeDieComponent', () => {
  let component: AttributeDieComponent;
  let fixture: ComponentFixture<AttributeDieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeDieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeDieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
