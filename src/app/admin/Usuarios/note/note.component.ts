import { Component } from '@angular/core';
import { NoteFormComponent } from 'src/app/forms/note-form/note-form.component';
import { Note } from 'src/app/models/note.model';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent {
  notes: Note[] = [];
  createdNote: Note = new Note();
  showForm: boolean = false;
  modalService: any;

  openCreateModal(): void {
    this.createdNote = new Note();
    this.showForm = true;

    const modalRef = this.modalService.open(NoteFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.Student = this.createdNote;
    modalRef.result.then(
      (result: string) => {
        if (result === 'created') {
        }
      },
      (reason: string) => {
        if (reason === 'closed') {
          this.closeCreatedModal();
        }
      }
    );
  }
  closeCreatedModal() {
    this.showForm = false;
  }



  
}
