import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterVaultComponent } from './character-vault.component';

describe('CharacterVaultComponent', () => {
  let component: CharacterVaultComponent;
  let fixture: ComponentFixture<CharacterVaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterVaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
