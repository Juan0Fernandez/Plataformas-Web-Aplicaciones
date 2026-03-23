  import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import { FormsModule } from '@angular/forms';
  import { AuthService } from '../../core/services/auth.service';
  import { ProjectService } from '../../core/services/project.service';
  import { AdvisoryService } from '../../core/services/advisory.service';
  import { EmailService } from '../../core/services/email.service';
  import { Project, ProjectType, ParticipationType } from '../../shared/interfaces/project.interface';
  import { Advisory, AdvisoryStatus } from '../../shared/interfaces/advisory.interface';
  import { NavbarComponent, NavMenuItem } from '../../shared/components/navbar/navbar.component';
  import { FooterComponent } from '../../shared/components/footer/footer.component';

  @Component({
    selector: 'app-programmer-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
    templateUrl: './programmer-dashboard.component.html',
    styleUrl: './programmer-dashboard.component.css'
  })
  export class ProgrammerDashboardComponent implements OnInit {
    currentUser: any = null;
    projects: Project[] = [];
    academicProjects: Project[] = [];
    professionalProjects: Project[] = [];
    advisories: Advisory[] = [];
    pendingAdvisories: Advisory[] = [];
    loading = true;
    loadingAdvisories = true;
    showAddProjectModal = false;
    selectedAdvisory: Advisory | null = null;
    responseMessage = '';
    navMenuItems: NavMenuItem[] = [];

    // Enums para el template
    ProjectType = ProjectType;
    ParticipationType = ParticipationType;
    AdvisoryStatus = AdvisoryStatus;

    // Formulario de nuevo proyecto
    newProject: Partial<Project> = {
      name: '',
      description: '',
      type: ProjectType.ACADEMIC,
      participationType: [],
      technologies: [],
      repositoryUrl: '',
      demoUrl: '',
      imageUrl: ''
    };

    techInput = '';
    selectedParticipations: ParticipationType[] = [];

    constructor(
      private authService: AuthService,
      private projectService: ProjectService,
      private advisoryService: AdvisoryService,
      private emailService: EmailService,
      private router: Router,
      private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
      this.authService.user$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.initializeNavMenu();
          this.loadProjects();
          this.loadAdvisories();
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

    loadProjects(): void {
      if (!this.currentUser) return;

      this.loading = true;
      this.projectService.getProjectsByProgrammer(this.currentUser.uid).subscribe(projects => {
        this.projects = projects;
        this.academicProjects = projects.filter(p => p.type === ProjectType.ACADEMIC);
        this.professionalProjects = projects.filter(p => p.type === ProjectType.PROFESSIONAL);
        this.loading = false;
        this.cdr.detectChanges();
      });
    }

    openAddProjectModal(): void {
      this.showAddProjectModal = true;
      this.resetForm();
    }

    closeAddProjectModal(): void {
      this.showAddProjectModal = false;
      this.resetForm();
    }

    resetForm(): void {
      this.newProject = {
        name: '',
        description: '',
        type: ProjectType.ACADEMIC,
        participationType: [],
        technologies: [],
        repositoryUrl: '',
        demoUrl: '',
        imageUrl: ''
      };
      this.techInput = '';
      this.selectedParticipations = [];
    }

    toggleParticipationType(type: ParticipationType): void {
      const index = this.selectedParticipations.indexOf(type);
      if (index > -1) {
        this.selectedParticipations.splice(index, 1);
      } else {
        this.selectedParticipations.push(type);
      }
    }

    addTechnology(): void {
      if (this.techInput.trim()) {
        if (!this.newProject.technologies) {
          this.newProject.technologies = [];
        }
        this.newProject.technologies.push(this.techInput.trim());
        this.techInput = '';
      }
    }

    removeTechnology(index: number): void {
      this.newProject.technologies?.splice(index, 1);
    }

    async saveProject(): Promise<void> {
      if (!this.currentUser) return;

      // Validar campos obligatorios
      if (!this.newProject.name || !this.newProject.description) {
        alert('Por favor completa el nombre y descripción del proyecto');
        return;
      }

      if (this.selectedParticipations.length === 0) {
        alert('Selecciona al menos un tipo de participación');
        return;
      }

      if (!this.newProject.technologies || this.newProject.technologies.length === 0) {
        alert('Agrega al menos una tecnología');
        return;
      }

      // Validar URLs obligatorias
      if (!this.newProject.repositoryUrl || !this.newProject.demoUrl || !this.newProject.imageUrl) {
        alert('Por favor completa todas las URLs (Repositorio, Demo e Imagen)');
        return;
      }

      // Validar formato de URLs
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

      if (!urlPattern.test(this.newProject.repositoryUrl)) {
        alert('La URL del repositorio no es válida. Debe ser una URL como: https://github.com/usuario/proyecto');
        return;
      }

      if (!urlPattern.test(this.newProject.demoUrl)) {
        alert('La URL del demo no es válida. Debe ser una URL como: https://mi-proyecto.vercel.app');
        return;
      }

      if (!urlPattern.test(this.newProject.imageUrl)) {
        alert('La URL de la imagen no es válida. Debe ser una URL como: https://ejemplo.com/imagen.jpg');
        return;
      }

      try {
        const projectData: Omit<Project, 'id'> = {
          name: this.newProject.name!,
          description: this.newProject.description!,
          type: this.newProject.type!,
          participationType: this.selectedParticipations,
          technologies: this.newProject.technologies || [],
          repositoryUrl: this.newProject.repositoryUrl,
          demoUrl: this.newProject.demoUrl,
          imageUrl: this.newProject.imageUrl,
          programmerId: this.currentUser.uid
        };

        await this.projectService.createProject(projectData);
        alert('Proyecto creado exitosamente');
        this.closeAddProjectModal();
        this.loadProjects();
      } catch (error) {
        console.error('Error creando proyecto:', error);
        alert('Error al crear el proyecto');
      }
    }

    async deleteProject(projectId: string): Promise<void> {
      if (confirm('¿Estás seguro de eliminar este proyecto?')) {
        try {
          await this.projectService.deleteProject(projectId);
          alert('Proyecto eliminado exitosamente');
          this.loadProjects();
        } catch (error) {
          console.error('Error eliminando proyecto:', error);
          alert('Error al eliminar el proyecto');
        }
      }
    }

    async logout(): Promise<void> {
      await this.authService.logout();
      this.router.navigate(['/login']);
    }

    goToPortfolio(): void {
      this.router.navigate(['/portfolio']);
    }

    goToMyPortfolio(): void {
      // Aquí podrías redirigir al portafolio individual del programador
      this.router.navigate(['/portfolio']);
    }

    // ========== ADVISORY METHODS ==========

    loadAdvisories(): void {
      if (!this.currentUser) return;

      this.loadingAdvisories = true;
      this.advisoryService.getAdvisoriesByProgrammer(this.currentUser.uid).subscribe(advisories => {
        this.advisories = advisories;
        this.pendingAdvisories = advisories.filter(a => a.status === AdvisoryStatus.PENDING);
        this.loadingAdvisories = false;
        this.cdr.detectChanges();
      });
    }

    selectAdvisory(advisory: Advisory): void {
      this.selectedAdvisory = advisory;
      this.responseMessage = '';
    }

    closeAdvisoryDetail(): void {
      this.selectedAdvisory = null;
      this.responseMessage = '';
    }

    async approveAdvisory(): Promise<void> {
      if (!this.selectedAdvisory || !this.currentUser) return;

      try {
        // 1. Aprobar en Firestore
        await this.advisoryService.approveAdvisory(
          this.selectedAdvisory.id!,
          this.responseMessage || 'Asesoría aprobada'
        );

        // 2. Enviar email al usuario (sin bloquear el proceso)
        this.emailService.sendAdvisoryResponseToUser({
          userName: this.selectedAdvisory.userName,
          userEmail: this.selectedAdvisory.userEmail,
          programmerName: this.currentUser.displayName || 'Programador',
          programmerEmail: this.currentUser.email || '',
          date: this.convertToDate(this.selectedAdvisory.date),
          time: this.selectedAdvisory.time,
          status: 'approved'
        }).catch(error => {
          console.error('❌ Error al enviar email (no crítico):', error);
        });

        alert('Asesoría aprobada exitosamente');
        this.closeAdvisoryDetail();
        this.loadAdvisories();
      } catch (error) {
        console.error('Error aprobando asesoría:', error);
        alert('Error al aprobar la asesoría');
      }
    }

    // Helper para convertir fecha de Firestore
    private convertToDate(date: any): Date {
      if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate();
      } else if (date instanceof Date) {
        return date;
      } else {
        return new Date(date);
      }
    }

    async rejectAdvisory(): Promise<void> {
      if (!this.selectedAdvisory || !this.currentUser) return;

      if (!this.responseMessage.trim()) {
        alert('Por favor ingresa un motivo para rechazar la asesoría');
        return;
      }

      try {
        // 1. Rechazar en Firestore
        await this.advisoryService.rejectAdvisory(this.selectedAdvisory.id!, this.responseMessage);

        // 2. Enviar email al usuario (sin bloquear el proceso)
        this.emailService.sendAdvisoryResponseToUser({
          userName: this.selectedAdvisory.userName,
          userEmail: this.selectedAdvisory.userEmail,
          programmerName: this.currentUser.displayName || 'Programador',
          programmerEmail: this.currentUser.email || '',
          date: this.convertToDate(this.selectedAdvisory.date),
          time: this.selectedAdvisory.time,
          status: 'rejected',
          rejectionReason: this.responseMessage
        }).catch(error => {
          console.error('❌ Error al enviar email (no crítico):', error);
        });

        alert('Asesoría rechazada');
        this.closeAdvisoryDetail();
        this.loadAdvisories();
      } catch (error) {
        console.error('Error rechazando asesoría:', error);
        alert('Error al rechazar la asesoría');
      }
    }

    getStatusBadgeClass(status: AdvisoryStatus): string {
      switch (status) {
        case AdvisoryStatus.PENDING:
          return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50';
        case AdvisoryStatus.APPROVED:
          return 'bg-green-600/20 text-green-400 border-green-600/50';
        case AdvisoryStatus.REJECTED:
          return 'bg-red-600/20 text-red-400 border-red-600/50';
        case AdvisoryStatus.CANCELLED:
          return 'bg-gray-600/20 text-gray-400 border-gray-600/50';
        default:
          return 'bg-gray-600/20 text-gray-400 border-gray-600/50';
      }
    }

    getStatusText(status: AdvisoryStatus): string {
      switch (status) {
        case AdvisoryStatus.PENDING:
          return 'Pendiente';
        case AdvisoryStatus.APPROVED:
          return 'Aprobada';
        case AdvisoryStatus.REJECTED:
          return 'Rechazada';
        case AdvisoryStatus.CANCELLED:
          return 'Cancelada';
        default:
          return status;
      }
    }

    formatDate(date: any): string {
      if (!date) return '';

      let dateObj: Date;
      if (date.toDate && typeof date.toDate === 'function') {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }

      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
