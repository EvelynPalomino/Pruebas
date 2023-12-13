import {Student} from "./student.model";
import {Teacher} from "./teacher.model";
import {Course} from "./course.model";
import {Grade} from "./grade.model";
import {NoteDetail} from "./notedetail.model";

export class Note{
    id_note: number = 0;
    teacher: Teacher = new Teacher();
    student: Student = new Student();
    course: Course = new Course();
    grade: Grade = new Grade();
    noteDetail: NoteDetail = new NoteDetail();
}
