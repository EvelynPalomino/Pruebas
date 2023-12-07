import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
// Importa otros módulos de Angular Material según sea necesario

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router) {}
  modalOpen: boolean = false;
  showAdminContent: boolean = false;
  showPrestamosContent: boolean = false;

  toggleAdmin() {
    this.showAdminContent = !this.showAdminContent;
    this.toggleSubMenu(
      this.showAdminContent,
      this.el.nativeElement.querySelector('#adminSubMenu')
    );
  }

  onTeacherSelected(selectedTeacher: string): void {
    // Agrega lógica para manejar la selección del profesor
    console.log('Teacher selected:', selectedTeacher);
  }

  togglePrestamos() {
    this.showPrestamosContent = !this.showPrestamosContent;
    this.toggleSubMenu(
      this.showPrestamosContent,
      this.el.nativeElement.querySelector('#prestamosSubMenu')
    );
  }

  toggleSubMenu(show: boolean, subMenu: HTMLElement) {
    if (show) {
      this.renderer.setStyle(subMenu, 'display', 'block');
    } else {
      this.renderer.setStyle(subMenu, 'display', 'none');
    }
  }
openConfirmModal(): void {
    // Abre el modal de confirmación
    this.modalOpen = true;
  }

  closeModal(): void {
    // Cierra el modal
    this.modalOpen = false;
  }

  logoutAndCloseModal(): void {
    // Coloca aquí la lógica para cerrar la sesión
    // this.authService.logout(); // Asegúrate de tener el servicio de autenticación configurado.

    // Cierra el modal después de cerrar la sesión
    this.modalOpen = false;

    // Redirige a la página de inicio de sesión u otra página según sea necesario
    this.router.navigate(['/login']);
  }
}
