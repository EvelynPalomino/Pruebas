export class Note{
    id_note: number = 0;
    teacher_id: number = 0;
    student_id: number = 0;
    courser_id: number = 1;
    grade_id: number = 0;
    noteDetail!: {
        id_notedetail: number;
        date_submitted: Date;
        comment_register: string;
        status_note: string;
    }; 
}


