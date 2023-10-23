import { Component, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  showAdminContent: boolean = false;
  showPrestamosContent: boolean = false;

  toggleAdmin() {
    this.showAdminContent = !this.showAdminContent;
    this.toggleSubMenu(
      this.showAdminContent,
      this.el.nativeElement.querySelector('#adminSubMenu')
    );
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
}
