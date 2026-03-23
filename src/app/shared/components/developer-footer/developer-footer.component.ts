import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DeveloperInfo {
  name: string;
  title: string;
  github?: string;
  linkedin?: string;
  email?: string;
  whatsapp?: string;
  logo?: string;
}

@Component({
  selector: 'app-developer-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './developer-footer.component.html',
  styleUrl: './developer-footer.component.css'
})
export class DeveloperFooterComponent {
  @Input() developer!: DeveloperInfo;

  currentYear = new Date().getFullYear();

  openWhatsApp(): void {
    if (this.developer.whatsapp) {
      const phone = this.developer.whatsapp.replace(/\D/g, ''); // Eliminar caracteres no numéricos
      const url = `https://wa.me/${phone}`;
      window.open(url, '_blank');
    }
  }

  openEmail(): void {
    if (this.developer.email) {
      window.location.href = `mailto:${this.developer.email}`;
    }
  }
}
