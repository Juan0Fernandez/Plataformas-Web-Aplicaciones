import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent, NavMenuItem } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AdvisoryModalComponent } from '../../../shared/components/advisory-modal/advisory-modal.component';
import Swal from 'sweetalert2';

interface Developer {
  id: number;
  name: string;
  image: string;
  greeting: string;
  description: string;
  bio: string;
  github: string;
  linkedin: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Skill {
  name: string;
  level: number;
  icon: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, AdvisoryModalComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.css'
})
export class PortfolioComponent implements OnInit {
  currentUser: any = null;
  menuOpen = false;
  showAdvisoryModal = false;
  navMenuItems: NavMenuItem[] = [];

  developers: Developer[] = [
    {
      id: 1,
      name: 'Alexander Chuquipoma',
      image: '/imagenes/alex.png',
      greeting: '¡Qué onda Mijo!',
      description: 'Soy Alexander Chuquipoma, un desarrollador web apasionado por crear soluciones innovadoras y eficientes.',
      bio: 'He trabajado con Angular, Firebase y arquitecturas modernas basadas en microservicios.',
      github: 'https://github.com/AlexChuquipoma',
      linkedin: 'https://www.linkedin.com/in/alexander-chuquipoma-a62686220/'
    },
    {
      id: 2,
      name: 'Juan Fernández',
      image: '/imagenes/juan.png',
      greeting: '¡Holaa!',
      description: 'Soy Juan Fernández, un desarrollador web dedicado a construir aplicaciones web atractivas y funcionales.',
      bio: 'Tengo experiencia en el desarrollo front-end y back-end, utilizando tecnologías como Angular, Node.js y bases de datos NoSQL.',
      github: 'https://github.com/Juan0Fernandez',
      linkedin: 'https://www.linkedin.com/in/juan-fernandez-074a3734b/'
    }
  ];

  features: Feature[] = [
    {
      icon: '👥',
      title: 'Carteras multiusuario',
      description: 'Cuentas administradas por el administrador para que los programadores muestren su trabajo.'
    },
    {
      icon: '📅',
      title: 'Reserva de asesoramiento',
      description: 'Los usuarios externos pueden programar fácilmente sesiones de asesoramiento con los programadores disponibles.'
    },
    {
      icon: '💡',
      title: 'Sistema de Notificaciones Válidas',
      description: 'Implemente notificaciones seguras y validadas para administradores, programadores y usuarios, asegurando una comunicación oportuna y verificada dentro del sistema.'
    },
    {
      icon: '🔐',
      title: 'Acceso basado en roles',
      description: 'Paneles de control seguros y diferenciados para administradores, programadores y usuarios.'
    }
  ];

  skills: Skill[] = [
    { name: 'Angular', level: 90, icon: '🅰️' },
    { name: 'TypeScript', level: 85, icon: '💙' },
    { name: 'JavaScript', level: 95, icon: '🟨' },
    { name: 'Node.js', level: 80, icon: '🟢' },
    { name: 'HTML/CSS', level: 90, icon: '🎨' },
    { name: 'Tailwind CSS', level: 85, icon: '💨' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del usuario
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.initializeNavMenu();
      }
      // Forzar detección de cambios después de actualizar currentUser
      this.cdr.detectChanges();
    });
  }

  initializeNavMenu(): void {
    this.navMenuItems = [
      {
        label: 'Mi Perfil',
        icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
        action: () => this.router.navigate(['/profile'])
      }
    ];
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.menuOpen = false;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToProfile(developerId: number): void {
    if (developerId === 1) {
      this.router.navigate(['/portfolio/alexander']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else if (developerId === 2) {
      this.router.navigate(['/portfolio/juan']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  openAdvisoryModal(): void {
    // Verificar si el usuario está autenticado
    if (!this.currentUser) {
      Swal.fire({
        title: 'Inicia Sesión',
        text: 'Para agendar una asesoría necesitas iniciar sesión o registrarte.',
        showCancelButton: true,
        confirmButtonText: 'Iniciar Sesión',
        cancelButtonText: 'Cancelar',
        background: '#7c3aed',
        color: '#ffffff'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }
    this.showAdvisoryModal = true;
  }

  closeAdvisoryModal(): void {
    this.showAdvisoryModal = false;
  }
}