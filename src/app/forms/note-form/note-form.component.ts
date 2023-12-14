import { Component } from '@angular/core';
import { Note } from '../../models/note.model'; // Ajusta la ruta según tu estructura
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tu-componente',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent {

  note: Note = new Note(); // Instancia de la clase Note
  notesService: any;
  modalService: any;
  router: any;


  create(): void {
    this.note.noteDetail.status_note = 'A';

    this.notesService.create(this.note).subscribe(
      (note: { nameTeacher: any; }) => {
        // Abre un modal (SweetAlert2) después de crear exitosamente
        Swal.fire({
          title: 'Operacion Exitosa',
          text: `Usuario ${note.nameTeacher} !`,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok'
        }).then(() => {
          // Redirige a la página principal de profesores después de cerrar el modal
          this.router.navigate(['/Note']);
          // Recarga la página
          window.location.reload();
        });
      },
      (error: any) => {
        // Muestra mensaje de error si hay un problema
        Swal.fire('Error', 'Completa los campos y verifica si estan correctos', 'error');
      }
    );
  }

  closeModal(): void {
    // Puedes cerrar el modal usando el servicio NgbModal
    this.modalService.dismissAll();
  }
  
}
