import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCharFormComponent } from './new-char-form.component';

describe('NewCharFormComponent', () => {
  let component: NewCharFormComponent;
  let fixture: ComponentFixture<NewCharFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCharFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCharFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
