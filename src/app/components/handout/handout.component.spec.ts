import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandoutComponent } from './handout.component';

describe('HandoutComponent', () => {
  let component: HandoutComponent;
  let fixture: ComponentFixture<HandoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
