import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterPresentationComponent } from './character-presentation.component';

describe('CharacterPresentationComponent', () => {
  let component: CharacterPresentationComponent;
  let fixture: ComponentFixture<CharacterPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterPresentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
