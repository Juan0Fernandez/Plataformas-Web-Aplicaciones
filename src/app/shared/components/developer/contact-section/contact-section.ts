import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../../../../core/services/email.service';
import { AuthService } from '../../../../core/services/auth.service';

export interface ContactInfo {
  name: string;
  title: string;
  email?: string;
  github: string;
  linkedin: string;
  whatsapp?: string;
}

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.css',
})
export class ContactSection implements OnInit {
  @Input({ required: true }) developer!: ContactInfo;

  private fb = inject(FormBuilder);
  private emailService = inject(EmailService);
  private authService = inject(AuthService);
  private router = inject(Router);

  contactForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;
  isAuthenticated = false;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  async onSubmit(): Promise<void> {
    // Verificar autenticación antes de enviar
    if (!this.isAuthenticated) {
      return; // El formulario no debería estar visible, pero por seguridad
    }

    if (this.contactForm.invalid || this.isSubmitting) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';

    const formData = this.contactForm.value;

    const result = await this.emailService.sendContactMessage({
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message
    });

    this.submitSuccess = result.success;
    this.submitMessage = result.message;
    this.isSubmitting = false;

    if (result.success) {
      this.contactForm.reset();
    }

    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      this.submitMessage = '';
    }, 5000);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }
}
