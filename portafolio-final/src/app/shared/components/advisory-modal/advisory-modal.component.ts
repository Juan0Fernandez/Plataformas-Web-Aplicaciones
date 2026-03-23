import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { AdvisoryService } from '../../../core/services/advisory.service';
import { ScheduleService } from '../../../core/services/schedule.service';
import { EmailService } from '../../../core/services/email.service';
import { User } from '../../models/user.model';
import { UserRole } from '../../interfaces/role.interface';
import { Schedule, TimeSlot } from '../../interfaces/advisory.interface';

@Component({
  selector: 'app-advisory-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advisory-modal.component.html',
  styleUrl: './advisory-modal.component.css'
})
export class AdvisoryModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  advisoryForm: FormGroup;
  programmers: User[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  currentUser: any = null;

  // Sistema dinámico de horarios
  availableDates: Date[] = [];
  availableTimeSlots: TimeSlot[] = [];
  programmerSchedules: Schedule[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private advisoryService: AdvisoryService,
    private scheduleService: ScheduleService,
    private emailService: EmailService,
    private cdr: ChangeDetectorRef
  ) {
    this.advisoryForm = this.fb.group({
      programmerId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      this.cdr.detectChanges();
    });

    this.loadProgrammers();

    // Escuchar cambios en programmerId para cargar horarios
    this.advisoryForm.get('programmerId')?.valueChanges.subscribe(programmerId => {
      if (programmerId) {
        this.loadProgrammerSchedules(programmerId);
      }
    });

    // Escuchar cambios en date para cargar slots de tiempo
    this.advisoryForm.get('date')?.valueChanges.subscribe(date => {
      if (date) {
        this.loadAvailableTimeSlots(date);
      }
    });
  }

  loadProgrammers(): void {
    console.log('🔍 AdvisoryModal: Iniciando carga de programadores...');
    this.userService.getProgrammers().subscribe({
      next: (programmers) => {
        console.log('✅ AdvisoryModal: Programadores recibidos:', programmers);
        this.programmers = programmers;
        console.log('✅ AdvisoryModal: this.programmers actualizado:', this.programmers);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ AdvisoryModal: Error al cargar programadores:', error);
        this.programmers = [];
        this.cdr.detectChanges();
      }
    });
  }

  loadProgrammerSchedules(programmerId: string): void {
    console.log('🔍 Cargando horarios del programador:', programmerId);
    this.scheduleService.getSchedulesByProgrammer(programmerId).subscribe({
      next: (schedules) => {
        // Filtrar solo horarios activos y futuros
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.programmerSchedules = schedules.filter(schedule => {
          if (!schedule.isActive) return false;

          const scheduleDate = this.convertToDate(schedule.date);
          return scheduleDate >= today;
        });

        console.log('✅ Horarios del programador cargados:', this.programmerSchedules);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error cargando horarios:', error);
        this.programmerSchedules = [];
        this.cdr.detectChanges();
      }
    });
  }

  async loadAvailableTimeSlots(selectedDate: string): Promise<void> {
    const programmerId = this.advisoryForm.get('programmerId')?.value;
    if (!programmerId) return;

    // Encontrar el horario para la fecha seleccionada
    const selectedDateObj = new Date(selectedDate);
    const schedule = this.programmerSchedules.find(s => {
      const schedDate = this.convertToDate(s.date);
      return this.isSameDate(schedDate, selectedDateObj);
    });

    if (!schedule) {
      this.availableTimeSlots = [];
      this.cdr.detectChanges();
      return;
    }

    // Generar slots de tiempo basados en startTime y endTime
    const slots = this.generateTimeSlots(schedule.startTime, schedule.endTime);

    // Verificar qué slots ya están reservados
    this.advisoryService.getAdvisoriesByProgrammer(programmerId).subscribe({
      next: async (advisories) => {
        const reserved = advisories.filter(adv => {
          const advDate = this.convertToDate(adv.date);
          return this.isSameDate(advDate, selectedDateObj) &&
                 (adv.status === 'pending' || adv.status === 'approved');
        });

        const reservedTimes = reserved.map(adv => adv.time);

        this.availableTimeSlots = slots.map(time => ({
          time,
          available: !reservedTimes.includes(time)
        }));

        console.log('✅ Slots de tiempo generados:', this.availableTimeSlots);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error verificando disponibilidad:', error);
        this.availableTimeSlots = slots.map(time => ({ time, available: true }));
        this.cdr.detectChanges();
      }
    });
  }

  generateTimeSlots(startTime: string, endTime: string): string[] {
    const slots: string[] = [];
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return slots;
  }

  convertToDate(date: any): Date {
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate();
    } else if (date instanceof Date) {
      return date;
    } else {
      return new Date(date);
    }
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  getAvailableDates(): string[] {
    return this.programmerSchedules.map(schedule => {
      const date = this.convertToDate(schedule.date);
      return date.toISOString().split('T')[0];
    });
  }

  formatScheduleDate(date: any): string {
    const dateObj = this.convertToDate(date);
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async onSubmit(): Promise<void> {
    if (this.advisoryForm.valid && this.currentUser) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const formValue = this.advisoryForm.value;
        const selectedProgrammer = this.programmers.find(p => p.uid === formValue.programmerId);

        if (!selectedProgrammer) {
          throw new Error('Programador no encontrado');
        }

        const userData = this.authService.getCurrentUserData();
        const advisoryDate = new Date(formValue.date);

        // 1. Crear la asesoría en Firestore
        await this.advisoryService.createAdvisory(
          this.currentUser.uid,
          userData?.displayName || this.currentUser.displayName || 'Usuario',
          this.currentUser.email!,
          selectedProgrammer.displayName || 'Programador',
          {
            programmerId: formValue.programmerId,
            date: advisoryDate,
            time: formValue.time,
            comment: formValue.comment
          }
        );

        // 2. Enviar email al programador (sin bloquear el proceso)
        this.emailService.sendAdvisoryRequestToProgrammer({
          programmerName: selectedProgrammer.displayName || 'Programador',
          programmerEmail: selectedProgrammer.email || '',
          userName: userData?.displayName || this.currentUser.displayName || 'Usuario',
          userEmail: this.currentUser.email!,
          date: advisoryDate,
          time: formValue.time,
          comment: formValue.comment || ''
        }).catch(error => {
          // No bloqueamos el proceso si falla el email
          console.error('❌ Error al enviar email (no crítico):', error);
        });

        this.successMessage = '¡Solicitud de asesoría enviada exitosamente!';
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      } catch (error) {
        console.error('Error al crear asesoría:', error);
        this.errorMessage = 'Error al enviar la solicitud. Intenta de nuevo.';
      } finally {
        this.loading = false;
      }
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  // Obtener fecha mínima (hoy)
  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  get programmerId() { return this.advisoryForm.get('programmerId'); }
  get date() { return this.advisoryForm.get('date'); }
  get time() { return this.advisoryForm.get('time'); }
  get comment() { return this.advisoryForm.get('comment'); }
}
