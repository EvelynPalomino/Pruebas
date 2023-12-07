import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherInactivosComponent } from './teacher-inactivos.component';

describe('TeacherInactivosComponent', () => {
  let component: TeacherInactivosComponent;
  let fixture: ComponentFixture<TeacherInactivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherInactivosComponent]
    });
    fixture = TestBed.createComponent(TeacherInactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
