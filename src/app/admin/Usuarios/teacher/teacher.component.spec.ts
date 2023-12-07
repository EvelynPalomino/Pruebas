import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherComponent } from './TeacherComponent.1';

describe('TeacherComponent', () => {
  let component: TeacherComponent;
  let fixture: ComponentFixture<TeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherComponent]
    });
    fixture = TestBed.createComponent(TeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
