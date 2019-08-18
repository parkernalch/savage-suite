import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomContentComponent } from './add-custom-content.component';

describe('AddCustomContentComponent', () => {
  let component: AddCustomContentComponent;
  let fixture: ComponentFixture<AddCustomContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
