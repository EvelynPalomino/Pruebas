import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInactivosComponent } from './student-inactivos.component';

describe('StudentInactivosComponent', () => {
  let component: StudentInactivosComponent;
  let fixture: ComponentFixture<StudentInactivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentInactivosComponent]
    });
    fixture = TestBed.createComponent(StudentInactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
