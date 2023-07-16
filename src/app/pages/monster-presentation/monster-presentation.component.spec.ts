import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterPresentationComponent } from './monster-presentation.component';

describe('MonsterPresentationComponent', () => {
  let component: MonsterPresentationComponent;
  let fixture: ComponentFixture<MonsterPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonsterPresentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
