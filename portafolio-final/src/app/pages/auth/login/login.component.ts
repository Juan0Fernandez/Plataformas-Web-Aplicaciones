import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      const result = await this.authService.login(email, password);

      if (result.success) {
        await this.redirectBasedOnRole();
      } else {
        this.errorMessage = result.message;
      }

      this.isLoading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    const result = await this.authService.loginWithGoogle();

    if (result.success) {
      await this.redirectBasedOnRole();
    } else {
      this.errorMessage = result.message;
    }

    this.isLoading = false;
  }

  /**
   * Redirigir según el rol del usuario
   */
  private async redirectBasedOnRole(): Promise<void> {
    // Esperar un momento para que se actualice el currentUserData
    await new Promise(resolve => setTimeout(resolve, 500));

    const role = await this.authService.getCurrentUserRole();

    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'programmer') {
      this.router.navigate(['/programmer']);
    } else {
      this.router.navigate(['/portfolio']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}